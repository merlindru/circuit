import { Fn, Pipe, pipe } from "./pipe";

export interface BaseCtx {}

export type Middleware<Input, Ctx, Result = any> = (
	req: Input,
	ctx: Ctx
) => Result;

export type Config<Mw extends Middleware<any, any> | undefined> = {
	middleware?: Mw;
};

type ResolveConfig<C> = C | ((args: { pipe: typeof pipe }) => C);

export function setupCircuit<FirstInput, C extends Config<any> = Config<any>>(
	resolveConfig?: ResolveConfig<C>
) {
	const config =
		typeof resolveConfig === "function"
			? resolveConfig({ pipe })
			: resolveConfig;

	function compose<
		Prev = FirstInput,
		PrevCtx = unknown,
		Next = unknown,
		NextCtx = PrevCtx
	>(fn: Fn<Prev, Next, PrevCtx, NextCtx>) {
		return fn;
	}

	compose.pipe = pipe as Pipe<FirstInput, BaseCtx>;

	async function runMiddleware(input: FirstInput, ctx?: BaseCtx) {
		return config?.middleware?.(input, ctx);
	}

	const r = /* @__PURE__ */ { compose, runMiddleware };

	return r;
}
