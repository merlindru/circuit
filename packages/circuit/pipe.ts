import type { BaseCtx } from "./setup";

type FakeResult<Value = unknown, Ctx = unknown> = { value: Value; ctx: Ctx };

export type InnerFn<I, C, R> = (
	input: I,
	context: C
) => R extends PromiseLike<unknown> ? R : Promise<R>;

export type Input<T> = Exclude<Awaited<T>, Response>;

export type Fn<Prev, Next, PrevCtx, NextCtx = PrevCtx> = (
	input: Input<Prev>,
	context: PrevCtx
) => Next extends FakeResult ? never : Next | FakeResult<Next, NextCtx>;

type Pipe2<A, CA> = <B, C, CB = CA, CC = CB>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>) => InnerFn<A, unknown, C>; // prettier-ignore
type Pipe3<A, CA> = <B, C, D, CB = CA, CC = CB, CD = CC>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>) => InnerFn<A, unknown, D>; // prettier-ignore
type Pipe4<A, CA> = <B, C, D, E, CB = CA, CC = CB, CD = CC, CE = CD>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>) => InnerFn<A, unknown, E>; // prettier-ignore
type Pipe5<A, CA> = <B, C, D, E, F, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>) => InnerFn<A, unknown, F>; // prettier-ignore
type Pipe6<A, CA> = <B, C, D, E, F, G, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>) => InnerFn<A, unknown, G>; // prettier-ignore
type Pipe7<A, CA> = <B, C, D, E, F, G, H, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>) => InnerFn<A, unknown, H>; // prettier-ignore
type Pipe8<A, CA> = <B, C, D, E, F, G, H, I, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>) => InnerFn<A, unknown, I>; // prettier-ignore
type Pipe9<A, CA> = <B, C, D, E, F, G, H, I, J, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>) => InnerFn<A, unknown, J>; // prettier-ignore
type Pipe10<A, CA> = <B, C, D, E, F, G, H, I, J, K, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>) => InnerFn<A, unknown, K>; // prettier-ignore
type Pipe11<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>) => InnerFn<A, unknown, L>; // prettier-ignore
type Pipe12<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>) => InnerFn<A, unknown, M>; // prettier-ignore
type Pipe13<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>) => InnerFn<A, unknown, N>; // prettier-ignore
type Pipe14<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>) => InnerFn<A, unknown, O>; // prettier-ignore
type Pipe15<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>) => InnerFn<A, unknown, P>; // prettier-ignore
type Pipe16<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>) => InnerFn<A, unknown, Q>; // prettier-ignore
type Pipe17<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>) => InnerFn<A, unknown, R>; // prettier-ignore
type Pipe18<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>) => InnerFn<A, unknown, S>; // prettier-ignore
type Pipe19<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>) => InnerFn<A, unknown, T>; // prettier-ignore
type Pipe20<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>) => InnerFn<A, unknown, U>; // prettier-ignore
type Pipe21<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>) => InnerFn<A, unknown, V>; // prettier-ignore
type Pipe22<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>) => InnerFn<A, unknown, W>; // prettier-ignore
type Pipe23<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV, CX = CW>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>, w: Fn<Input<W>, X, CW, CX>) => InnerFn<A, unknown, X>; // prettier-ignore
type Pipe24<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV, CX = CW, CY = CX>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>, w: Fn<Input<W>, X, CW, CX>, x: Fn<Input<X>, Y, CX, CY>) => InnerFn<A, unknown, Y>; // prettier-ignore
type Pipe25<A, CA> = <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, CB = CA, CC = CB, CD = CC, CE = CD, CF = CE, CG = CF, CH = CG, CI = CH, CJ = CI, CK = CJ, CL = CK, CM = CL, CN = CM, CO = CN, CP = CO, CQ = CP, CR = CQ, CS = CR, CT = CS, CU = CT, CV = CU, CW = CV, CX = CW, CY = CX, CZ = CY>(a: Fn<Input<A>, B, CA, CB>, b: Fn<Input<B>, C, CB, CC>, c: Fn<Input<C>, D, CC, CD>, d: Fn<Input<D>, E, CD, CE>, e: Fn<Input<E>, F, CE, CF>, f: Fn<Input<F>, G, CF, CG>, g: Fn<Input<G>, H, CG, CH>, h: Fn<Input<H>, I, CH, CI>, i: Fn<Input<I>, J, CI, CJ>, j: Fn<Input<J>, K, CJ, CK>, k: Fn<Input<K>, L, CK, CL>, l: Fn<Input<L>, M, CL, CM>, m: Fn<Input<M>, N, CM, CN>, n: Fn<Input<N>, O, CN, CO>, o: Fn<Input<O>, P, CO, CP>, p: Fn<Input<P>, Q, CP, CQ>, q: Fn<Input<Q>, R, CQ, CR>, r: Fn<Input<R>, S, CR, CS>, s: Fn<Input<S>, T, CS, CT>, t: Fn<Input<T>, U, CT, CU>, u: Fn<Input<U>, V, CU, CV>, v: Fn<Input<V>, W, CV, CW>, w: Fn<Input<W>, X, CW, CX>, x: Fn<Input<X>, Y, CX, CY>, y: Fn<Input<Y>, Z, CY, CZ>) => InnerFn<A, unknown, Z>; // prettier-ignore

export type Pipe<First, FirstCtx> = Pipe2<First, FirstCtx> & Pipe3<First, FirstCtx> & Pipe4<First, FirstCtx> & Pipe5<First, FirstCtx> & Pipe6<First, FirstCtx> & Pipe7<First, FirstCtx> & Pipe8<First, FirstCtx> & Pipe9<First, FirstCtx> & Pipe10<First, FirstCtx> & Pipe11<First, FirstCtx> & Pipe12<First, FirstCtx> & Pipe13<First, FirstCtx> & Pipe14<First, FirstCtx> & Pipe15<First, FirstCtx> & Pipe16<First, FirstCtx> & Pipe17<First, FirstCtx> & Pipe18<First, FirstCtx> & Pipe19<First, FirstCtx> & Pipe20<First, FirstCtx> & Pipe21<First, FirstCtx> & Pipe22<First, FirstCtx> & Pipe23<First, FirstCtx> & Pipe24<First, FirstCtx> & Pipe25<First, FirstCtx>; // prettier-ignore

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

		const r = /* @__PURE__ */ lastResult;

		return r;
	};
}
