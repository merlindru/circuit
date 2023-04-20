import {
	Config as BaseConfig,
	Middleware,
	Pipe,
	pipe,
	setupCircuit,
} from "@circ/circuit";
import {
	Session as RemixSession,
	SessionStorage as RemixStorage,
} from "@remix-run/server-runtime";
import { ZodError, ZodSchema, z } from "zod";

type ResolveConfig<C> = C | ((args: { pipe: typeof pipe }) => C);

type DefaultAuthConfig<SessionData> = {
	onLoggedOut?: (ctx: {
		session: RemixSession<SessionData>;
	}) => Response | Promise<Response>;
	onForbidden?: (ctx: {
		session: RemixSession<SessionData>;
	}) => Response | Promise<Response>;

	onAuthorized?: (ctx: {
		session: RemixSession<SessionData>;
	}) => void | Promise<void>;
};

export type Config<
	Mw extends Middleware<any, any>,
	SessionData,
	AuthRequirements = any
> = BaseConfig<Mw> & {
	session?: {
		storage: RemixStorage<SessionData>;
	};
	isLoggedIn?: (session: RemixSession<SessionData>) => boolean;
	isAuthorized?: (
		session: RemixSession<SessionData>,
		requirements: AuthRequirements
	) => boolean;
};

export function setupRemixCircuit<
	DataFnArgs extends {
		request: Request;
		params: Record<string, any>;
	},
	SessionData,
	AuthRequirements = any,
	C extends Config<any, SessionData, AuthRequirements> = Config<
		any,
		SessionData,
		AuthRequirements
	>
>(resolveConfig?: ResolveConfig<C>) {
	const config =
		typeof resolveConfig === "function"
			? resolveConfig({ pipe })
			: resolveConfig;

	const circuit = setupCircuit<DataFnArgs, C>(config);

	const dataFn = _dataFn as Pipe<DataFnArgs, Ctx>;

	const compose = circuit.compose as typeof circuit.compose & {
		action: typeof dataFn;
		loader: typeof dataFn;
		intent: typeof intent;
		params: typeof params;
		json: typeof json;
		formData: typeof formData;
		zod: typeof zod;
	} & IfConfigHas<
			"session",
			{
				auth: typeof auth;
				withSession: typeof withSession;
			}
		>;

	compose.action = dataFn;
	compose.loader = dataFn;

	// Utils
	compose.intent = intent;
	compose.json = json;
	compose.formData = formData;

	// Validation
	compose.zod = zod;

	// Auth
	if (config?.session !== undefined) {
		compose.auth = auth;
		compose.withSession = withSession;
	}

	// ------------------------------------------------------------------------

	type IfConfigHas<
		ConfigKey extends keyof C,
		T
	> = C[ConfigKey] extends undefined ? never : T;

	// Context arg type based on the ctx the middleware returns
	// (Well, to nitpick, the middleware doesn't return the context object -- we pass
	// it into the middleware, and the middleware mutates it. The type of `Ctx` here
	// is the type of the ctx object after the middleware has run.)
	type Ctx = C extends Config<
		Middleware<DataFnArgs, infer MiddlewareCtx>,
		any
	>
		? MiddlewareCtx
		: {};

	type AnyFunctionArray = ((...args: any[]) => any)[];

	type TerminalValue = Promise<null | Response> | null | Response;
	type TerminalFn<I, C> = (input: I, ctx: C) => TerminalValue;

	type Params = Record<string, string>;

	// A "data function" is either a loader or an action (Remix terminology)
	// This function wraps a loader/action to do two things:
	// 1. handle middleware
	// 2. inject the context argument (2nd arg)
	function _dataFn(...fns: AnyFunctionArray) {
		return async (req: DataFnArgs, ctx: Ctx) => {
			try {
				if (!ctx) {
					ctx = {} as Ctx;
				}

				if (config?.middleware !== undefined) {
					const res = await config.middleware(req, ctx);

					if (res instanceof Response) {
						return res;
					}
				}

				return await pipe(...fns)(req, ctx); // `return await` needed for try/catch! do not remove
			} catch (err: any) {
				// if (config?.error !== undefined) {
				// 	// eslint-disable-next-line no-ex-assign
				// 	err = (await config.error(err)) ?? err;
				// }

				throw err;
			}
		};
	}

	// ----- Utils -----
	/**
	 * Required for type inference in {@link intent}
	 */
	type WithIntent<T, Intent> = T extends { intent: Intent } ? T : never;

	function intent<Intent extends string, I extends { intent: string }, C>(
		intent: Intent,
		fn: TerminalFn<WithIntent<I, Intent>, C>
	) {
		return compose<I, C, I, C>((input, ctx) => {
			if (input.intent === intent) {
				// We need to cast here. If this is the correct intent, then the
				// return type of `fn` doesn't matter, because the pipe stops here.
				//
				// In all other cases, we return the input as-is (see below),
				// so the return type of `fn` is irrelevant.
				return fn(input as any, ctx) as any;
			}

			return input;
		});
	}

	/**
	 * Parses the request body as JSON and returns it as an object.
	 *
	 * You can pass params to be merged into into the returned JSON object.
	 *
	 * **Note that if you do this,** and the request body is **not an object,** the output of this
	 * function will be `{ data: <request body>, ...params }`. For example:
	 *
	 * It's recommended to use {@link zod compose.zod} to validate that this function returns what you expect.
	 *
	 * @example
	 * compose.action(
	 *     json({ params: { userId: "uid" } }),
	 *     (input) => {
	 *         // if body is { name: "John" }:
	 *         const { name, userId } = input;
	 *
	 *         // if body is [123, 456, 789]:
	 *         const { data, userId } = input;
	 *
	 *         data[0] === 123;
	 *     }
	 * )
	 */
	function json<C>(opts?: { params: Params }) {
		return compose<DataFnArgs, C, Promise<any>, C>(
			async ({ request, params }) => {
				let merge: Params | undefined;

				let data = await request.json();

				if (typeof opts?.params === "object" && opts.params !== null) {
					merge = mapParams(opts.params, params);

					if (typeof data !== "object" || data === null) {
						data = { data };
					}
				}

				return transformNestedKeys({
					...data,
					...merge,
				});
			}
		);
	}

	/**
	 * Parses the request body as FormData and returns it as an object.
	 *
	 * @example
	 * <Form method="post">
	 *     <input type="text" name="name" />
	 * </Form>
	 *
	 * compose.pipe(
	 *     formData<{ name: string }>(), // note this is unsafe! (unvalidated)
	 *     (input, ctx) => {
	 *         // input is of type { name: string }
	 *    }
	 * );
	 *
	 * @example
	 * <Form method="post">
	 *    <input type="text" name="name" />
	 * </Form>
	 *
	 * compose.pipe(
	 *     compose.formData(), // unsafe -- let's fix that:
	 *     compose.zod(        // validate input (joi, ajv, yup, ... also work of course)
	 *         z.object({ name: z.string() })
	 *     ),
	 *     (input, ctx) => {
	 *         // input is of type { name: string }
	 *         // note how you didn't have to pass any generics to formData() unlike the example above
	 *     }
	 * }
	 */
	function formData<C>(opts?: { params: Params }) {
		return compose<
			DataFnArgs,
			C,
			Promise<Record<string, FormDataEntryValue | string>>,
			C
		>(async ({ request, params }) => {
			let merge: Params | undefined;

			if (typeof opts?.params === "object" && opts.params !== null) {
				merge = mapParams(opts.params, params);
			}

			const data = Object.fromEntries(await request.formData());

			return transformNestedKeys({
				...data,
				...merge,
			});
		});
	}

	function params<C>(mapping: Params) {
		return compose<DataFnArgs, C, Params, C>(({ params }) =>
			mapParams(mapping, params)
		);
	}

	/**
	 * Maps request parameters
	 *
	 * Mostly used in helper functions like {@link formData compose.formData} and {@link json compose.json}
	 *
	 * This also exists as a standalone helper: {@link params compose.params} (but it's not as useful)
	 *
	 * @example
	 * mapParams({ projectId: "pid" }, { pid: "123" }); // => { projectId: "123" }
	 *
	 * @example
	 * // Not particularly useful
	 * mapParams(["pid"], { pid: "123" }); // => { pid: "123" }
	 *
	 * @example
	 * // Let's make more sense of the previous example:
	 * mapParams({ 0: "pid", 1: "uid", foo: "bar" }); // => { pid: "123", uid: "456", foo: "bar" }
	 */
	function mapParams(
		mapping: Record<string, string>,
		requestParams: Record<string, string>
	) {
		const result: Record<string, string> = {};

		for (const mappingKey in mapping) {
			const mappingValue = (mapping as any)[mappingKey];

			if (typeof mappingKey === "string") {
				// key is a string, apply mapping
				//
				//            mappingKey ↴   mappingValue ↴
				// opts = { params: { projectId:        "pid" }
				//                       ↓                ↓
				//             result.projectId = params.pid
				result[mappingKey] = requestParams[mappingValue];
			} else if (typeof mappingKey === "number") {
				//
				//        mappingValue ↴
				// opts = { params: ["pid"] }
				//                     ↓           ↘
				//             result.pid = params.pid
				result[mappingValue] = requestParams[mappingValue];
			}
		}

		return result;
	}

	/**
	 * Validates the input using Zod. If the input is invalid, an error will be thrown.
	 *
	 * @param onError if the input is invalid, this function will be called with the error. (The error will still be thrown!)
	 *
	 * @example
	 * compose.pipe(
	 *     zod(z.object({ name: z.string() })),
	 *     (input, ctx) => {
	 *         // input is of type { name: string }
	 *     }
	 * );
	 */
	function zod<T extends ZodSchema, I, C>(
		schema: T,
		onError?: (err: ZodError) => void
	) {
		return compose<I, C, Promise<z.infer<T>>, C>(async (input) => {
			try {
				// Check if input is `FormData`
				if (input instanceof FormData) {
					return schema.parse(
						Object.fromEntries(input)
					) as z.infer<T>;
				}

				// Check if input has `Request` (likely one of first functions in the pipe)
				if (
					typeof input === "object" &&
					input !== null &&
					"request" in input &&
					input.request instanceof Request
				) {
					return schema.parse(
						Object.fromEntries(await input.request.formData())
					) as z.infer<T>;
				}

				return schema.parse(input) as z.infer<T>;
			} catch (e: any) {
				if (onError) {
					onError(e);
				}

				throw e;
			}
		});
	}

	// ----- Auth -----
	type WithSession = { session: RemixSession<SessionData> };

	function assertSessionStorage(
		s: RemixStorage | undefined
	): asserts s is RemixStorage {
		if (s === undefined) {
			throw new Error(
				"No session storage configured. Please set `session.storage` in setupRemixCircuit()."
			);
		}
	}

	/**
	 * Gets or creates a session using the configured `sessionStorage` and adds it to the context.
	 *
	 * **This does not mean the user is authenticated!**
	 *
	 * By default, Remix SessionStorage creates an empty session if no session cookie is found.
	 *
	 * @example
	 * compose.pipe(
	 *     withSession(),
	 *     (input, ctx) => {
	 *         ctx.session.set("foo", "bar");
	 *     }
	 * );
	 */
	function withSession<C>() {
		return compose<DataFnArgs, C, Promise<DataFnArgs>, C & WithSession>(
			async (input, ctx) => {
				assertSessionStorage(config?.session?.storage);

				(ctx as any).session = await config.session.storage.getSession(
					input.request.headers.get("Cookie")
				);

				return input;
			}
		);
	}

	type AuthConfig = DefaultAuthConfig<SessionData> &
		Parameters<typeof isAuthorized>[1];

	const isLoggedIn = config?.isLoggedIn ?? (() => false);
	const isAuthorized = config?.isAuthorized ?? (() => false);

	/**
	 * Same as {@link withSession}, but checks if the user is logged in and authorized.
	 *
	 *
	 * @example
	 * compose.pipe(
	 *     auth({ role: "admin" }), // depends on what params your isAuthorized function takes
	 *     async (input, ctx) => {
	 *          // use ctx.session
	 *          const userId = ctx.session.get("userId"); // depends on your SessionData
	 *     }
	 * );
	 */
	function auth(opts?: AuthConfig) {
		return compose(
			compose.pipe(withSession(), async (input, ctx) => {
				// Check if logged in
				if (!isLoggedIn(ctx.session)) {
					if (opts?.onLoggedOut) {
						return opts.onLoggedOut(ctx);
					}
					throw new Error("Unauthorized");
				}

				// Check if authorized
				if (opts && !isAuthorized(ctx.session, opts)) {
					if (opts?.onForbidden) {
						return opts.onForbidden(ctx);
					}
					throw new Error("Forbidden");
				}

				if (opts?.onAuthorized) {
					opts.onAuthorized(ctx);
				}

				return input;
			})
		) as ReturnType<typeof withSession>;
	}

	const r = /* @__PURE__ */ { compose };

	return r;
}

type Obj = Record<string, any>;

/**
 * Nests all keys of {@param obj} that contain a dot.
 *
 * This currently doesn't support objects like this: `{ "foo": 123, "foo.bar": 456 }` (where foo could be either a number or an object).
 * Using it this way is not stable and may change in the future.
 *
 * @example
 * transformNestedKeys({
 *     "foo.bar": 123,
 *     "foo.baz": 456,
 *     "que.sa.dil.la": true,
 *     "asdf": 789,
 * });
 * // =>
 * // {
 * //     foo: { bar: 123, baz: 456 },
 * //     que: { sa: { dil: { la: true } } },
 * //     asdf: 789,
 * // }
 */
function transformNestedKeys(obj: Obj): Obj {
	const result: Obj = {};

	for (const key in obj) {
		if (!key.includes(".")) {
			result[key] = obj[key];
			continue;
		}

		const parts = key.split(".");
		let currentLevel = result;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];

			// Check if we're at the last part of the key ("baz" in "foo.bar.baz")
			if (i === parts.length - 1) {
				currentLevel[part] = obj[key]; // Set to the original value
			} else {
				currentLevel[part] = currentLevel[part] || {}; // Ensure the next part exists
				currentLevel = currentLevel[part]; // Move to the next part
			}
		}
	}

	return result;
}
