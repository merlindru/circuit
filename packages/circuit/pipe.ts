import type { BaseCtx } from "./setup";

type FakeResult<Value = unknown, Ctx = unknown> = { value: Value; ctx: Ctx };

export type Pipe<I, C, R> = (
	input: I,
	context: C
) => R extends PromiseLike<unknown> ? R : Promise<R>;

export type Input<T> = Exclude<Awaited<T>, Response>;

export type Fn<Prev, Next, PrevCtx, NextCtx = PrevCtx> = (
	input: Input<Prev>,
	context: PrevCtx
) => Next extends FakeResult ? never : Next | FakeResult<Next, NextCtx>;

export function pipe<A, B, C, CA = BaseCtx, CB = CA, CC = CB>(a: Fn<A, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>): Pipe<A, unknown, C>; // prettier-ignore
export function pipe<A, B, C, D, CA = BaseCtx, CB = CA, CC = CB, CD = CC>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>): Pipe<A, unknown, D>; // prettier-ignore
export function pipe<A, B, C, D, E, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>): Pipe<A, unknown, E>; // prettier-ignore
export function pipe<A, B, C, D, E, F, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>): Pipe<A, unknown, F>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>): Pipe<A, unknown, G>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>): Pipe<A, unknown, H>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>): Pipe<A, unknown, I>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>): Pipe<A, unknown, J>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>): Pipe<A, unknown, K>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>): Pipe<A, unknown, L>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>): Pipe<A, unknown, M>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>): Pipe<A, unknown, N>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>): Pipe<A, unknown, O>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>): Pipe<A, unknown, P>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>): Pipe<A, unknown, Q>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>): Pipe<A, unknown, R>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>): Pipe<A, unknown, S>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>): Pipe<A, unknown, T>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>): Pipe<A, unknown, U>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>): Pipe<A, unknown, V>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>): Pipe<A, unknown, W>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV, CX = CW>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>, w: Fn<Input<W>, X, CW, CX>): Pipe<A, unknown, X>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV, CX = CW, CY = CX>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>, w: Fn<Input<W>, X, CW, CX>, x: Fn<Input<X>, Y, CX, CY>): Pipe<A, unknown, Y>; // prettier-ignore
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, CA = BaseCtx, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV, CX = CW, CY = CX, CZ = CY>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>, w: Fn<Input<W>, X, CW, CX>, x: Fn<Input<X>, Y, CX, CY>, y: Fn<Input<Y>, Z, CY, CZ>): Pipe<A, unknown, Z>; // prettier-ignore

export function pipe(...functions: unknown[]) {
	const fns = functions as Fn<unknown, unknown, unknown, unknown>[];

	return async (input: any, context: any) => {
		let lastResult = input;

		for (const fn of fns) {
			lastResult = await fn(lastResult, context);

			if (lastResult instanceof Response) {
				return lastResult;
			}
		}

		return lastResult;
	};
}
