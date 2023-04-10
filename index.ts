import { Fn, Pipe, pipe } from "./pipe";

export interface BaseCtx {}

export type Middleware<Input, Ctx, Result = any> = (
	req: Input,
	ctx: Ctx
) => Result;

export type Config<Mw extends Middleware<any, any> | undefined> = {
	middleware?: Mw;
	error?: <Err extends Error>(
		err: Err
	) => void | Promise<void> | Err | Promise<Err>;
};

export function setupCircuit<DataFnArgs, C extends Config<any> = Config<any>>(
	composeConfig?: C | ((args: { pipe: typeof pipe }) => C)
) {
	const config =
		typeof composeConfig === "function"
			? composeConfig({ pipe })
			: composeConfig;

	// const compose = <Ctx = {}, Input = DataFnArgs, Result = any>(
	// 	fn: Middleware<Input, Ctx & BaseCtx, Result>
	// ) => fn;

	function compose<
		Prev = DataFnArgs,
		PrevCtx = unknown,
		Next = unknown,
		NextCtx = PrevCtx
	>(fn: Fn<Prev, Next, PrevCtx, NextCtx>) {
		return fn;
	}

	compose.action = dataFn;
	compose.loader = dataFn;
	compose.pipe = pipe;

	return { compose };

	function dataFn<
		Ctx = C extends Config<Middleware<DataFnArgs, infer MiddlewareCtx>>
			? MiddlewareCtx
			: {},
		Cb extends Middleware<DataFnArgs, Ctx, any> | Pipe<any> = any
	>(cb: Cb) {
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

				return await cb(req, ctx); // `return await` needed for try/catch! do not remove
			} catch (err: any) {
				if (config?.error !== undefined) {
					// eslint-disable-next-line no-ex-assign
					err = (await config.error(err)) ?? err;
				}

				throw err;
			}
		}) as Cb extends Middleware<DataFnArgs, Ctx, infer Result>
			? Result
			: Cb extends Pipe<infer Result>
			? Result
			: never;
	}
}
