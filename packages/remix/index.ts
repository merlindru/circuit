import { ZodError, ZodSchema, z } from "zod";
import {
	Config as BaseConfig,
	Middleware,
	Pipe,
	pipe,
	setupCircuit,
} from "@circ/circuit";
import {
	SessionStorage,
	Session as RemixSession,
} from "@remix-run/server-runtime";

type ResolveConfig<C> = C | ((args: { pipe: typeof pipe }) => C);

type SessionData<Ss extends SessionStorage> = Ss extends SessionStorage<
	infer Data
>
	? Data
	: never;

type Config<
	Mw extends Middleware<any, any>,
	Ss extends SessionStorage
> = BaseConfig<Mw> & {
	session?: {
		storage: Ss;
		cookieName: string;
	};
	isLoggedIn?: (session: SessionData<Ss>) => boolean;
	isAuthorized?: <R>(session: SessionData<Ss>, requirements: R) => boolean;
};

export function setupRemixCircuit<
	DataFnArgs extends { request: Request },
	C extends Config<any, any> = Config<any, any>
>(resolveConfig?: ResolveConfig<C>) {
	const config =
		typeof resolveConfig === "function"
			? resolveConfig({ pipe })
			: resolveConfig;

	const circuit = setupCircuit(config);

	type IfConfigHas<
		ConfigKey extends keyof C,
		T
	> = C[ConfigKey] extends undefined ? never : T;

	const compose = circuit.compose as typeof circuit.compose & {
		action: typeof dataFn;
		loader: typeof dataFn;
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
	compose.formData = formData;
	compose.zod = zod;

	if (config?.session !== undefined) {
		compose.auth = auth;
		compose.withSession = withSession;
	}

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

	// Session types based on the session storage
	type SessData = C["session"] extends object
		? SessionData<C["session"]["storage"]>
		: never;
	type Session = RemixSession<SessData>;

	// A "data function" is either a loader or an action (Remix terminology)
	// This function wraps a loader/action to do two things:
	// 1. handle middleware
	// 2. inject the context argument (2nd arg)
	function dataFn<
		Callback extends Middleware<DataFnArgs, Ctx, any> | Pipe<any> = any
	>(callback: Callback) {
		return (async (req: DataFnArgs, ctx: Ctx) => {
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

				return await callback(req, ctx); // `return await` needed for try/catch! do not remove
			} catch (err: any) {
				// if (config?.error !== undefined) {
				// 	// eslint-disable-next-line no-ex-assign
				// 	err = (await config.error(err)) ?? err;
				// }

				throw err;
			}
		}) as Callback extends Middleware<DataFnArgs, Ctx, infer Result>
			? Result
			: Callback extends Pipe<infer Result>
			? Result
			: never;
	}

	// ----- Utils -----
	/**
	 * Parses form data and returns it as an object.
	 */
	function formData<C>() {
		return compose<DataFnArgs, C, unknown, C>(async ({ request }, ctx) => {
			return Object.fromEntries(await request.formData());
		});
	}

	// ----- Validation -----
	/**
	 * Validates the input using Zod. If the input is invalid, an error will be thrown.
	 *
	 * @param onError if the input is invalid, this function will be called with the error. (The error will still be thrown!)
	 */
	function zod<T extends ZodSchema, C>(
		schema: T,
		onError?: (err: ZodError) => void
	) {
		return compose<any, C, z.infer<T>, C>((data) => {
			try {
				return schema.parse(data) as z.infer<T>;
			} catch (e: any) {
				if (onError) {
					onError(e);
				}

				throw e;
			}
		});
	}

	// ----- Auth -----
	function assertSessionStorage(
		s: SessionStorage | undefined
	): asserts s is SessionStorage {
		throw new Error(
			"No session storage configured. Please set `session.storage` in setupRemixCircuit()."
		);
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
		return compose<
			DataFnArgs,
			C,
			Promise<DataFnArgs>,
			C & { session: Session }
		>(async (input, ctx) => {
			assertSessionStorage(config?.session?.storage);

			(ctx as any).session = await config.session.storage.getSession(
				input.request.headers.get(config.session.cookieName) ?? ""
			);

			return input;
		});
	}

	type CtxWithSession = { session: Session };

	type AuthConfig = {
		onLoggedOut?: (ctx: CtxWithSession) => Response | Promise<Response>;
		onForbidden?: (ctx: CtxWithSession) => Response | Promise<Response>;
	};

	const isLoggedIn = config?.isLoggedIn ?? (() => false);
	const isAuthorized = config?.isAuthorized ?? (() => false);

	/**
	 * Same as {@link withSession}, but checks if the user is logged in and authorized.
	 */
	function auth(authConfig?: AuthConfig) {
		return compose(
			compose.pipe(withSession(), async (input, ctx) => {
				// Check if logged in
				if (!isLoggedIn(ctx.session)) {
					if (authConfig?.onLoggedOut) {
						return authConfig.onLoggedOut(ctx);
					}
					throw new Error("Unauthorized");
				}

				// Check if authorized
				if (authConfig && !isAuthorized(ctx.session, authConfig)) {
					if (authConfig?.onForbidden) {
						return authConfig.onForbidden(ctx);
					}
					throw new Error("Forbidden");
				}

				return input;
			})
		) as ReturnType<typeof withSession>;
	}

	return { compose };
}
