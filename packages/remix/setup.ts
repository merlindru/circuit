import { ZodError, ZodSchema, z } from "zod";
import {
	Config as BaseConfig,
	Middleware,
	Pipe,
	pipe,
	setupCircuit,
} from "@circ/circuit";
import {
	SessionStorage as RemixStorage,
	Session as RemixSession,
} from "@remix-run/server-runtime";

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

	type IfConfigHas<
		ConfigKey extends keyof C,
		T
	> = C[ConfigKey] extends undefined ? never : T;

	const dataFn = _dataFn as Pipe<DataFnArgs, Ctx>;

	const compose = circuit.compose as typeof circuit.compose & {
		action: typeof dataFn;
		loader: typeof dataFn;
		formData: typeof formData;
		json: typeof json;
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
	compose.formData = formData;
	compose.json = json;

	// Validation
	compose.zod = zod;

	// Auth
	if (config?.session !== undefined) {
		compose.auth = auth;
		compose.withSession = withSession;
	}

	// ------------------------------------------------------------------------

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

	// A "data function" is either a loader or an action (Remix terminology)
	// This function wraps a loader/action to do two things:
	// 1. handle middleware
	// 2. inject the context argument (2nd arg)
	function _dataFn(...fns: ((...args: any[]) => any)[]) {
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

				return await pipe(fns)(req, ctx); // `return await` needed for try/catch! do not remove
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
	function json<C>() {
		return compose<DataFnArgs, C, Promise<any>, C>(async ({ request }) => {
			return request.json();
		});
	}

	/**
	 * Parses form data and returns it as an object.
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
	function formData<C>(opts?: { params: string[] | Record<string, string> }) {
		return compose<
			DataFnArgs,
			C,
			Promise<Record<string, FormDataEntryValue | string>>,
			C
		>(async ({ request, params }) => {
			let merge: Record<string, string> | undefined;

			if (opts?.params != null) {
				if (typeof opts.params === "object") {
					merge = {};

					for (const key in opts.params) {
						const value = (opts.params as any)[key];

						if (typeof key === "string") {
							// key is a string, apply mapping
							//
							//                    key ↴         value ↴
							// opts = { params: { projectId:        "pid" }
							//                       ↓                ↓
							//              merge.projectId = params.pid
							merge[key] = params[value];
						} else {
							//
							//       key and value ↴
							// opts = { params: ["pid"] }
							//                     ↓           ↘
							//              merge.pid = params.pid
							merge[value] = params[value];
						}
					}
				}
			}

			const data = Object.fromEntries(await request.formData());

			return transformNestedKeys({
				...data,
				...merge,
			});
		});
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
		return compose<I, C, z.infer<T>, C>((input) => {
			try {
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
