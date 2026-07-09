type MaybePromise<T> = T | PromiseLike<T>;
type AnyFunc = (...args: any[]) => any;
type PipeReturn<Prev, Next> = Prev extends PromiseLike<unknown>
  ? Promise<Awaited<Next>>
  : Next;

/**
 * Performs left-to-right function composition.
 *
 * @param {Function[]} fns The functions to pipe.
 * @returns {Function} A new function that pipes its arguments.
 *
 * @example
 * const addAbs = pipe((a, b) => a + b, Math.abs);
 * addAbs(-2, -3) //=> 5
 */
export default function pipe<Args extends unknown[], A>(
  fn1: (...args: Args) => A,
): (...args: Args) => A;
export default function pipe<Args extends unknown[], A, B>(
  fn1: (...args: Args) => A,
  fn2: (arg: Awaited<A>) => B,
): (...args: Args) => PipeReturn<A, B>;
export default function pipe<Args extends unknown[], A, B, C>(
  fn1: (...args: Args) => A,
  fn2: (arg: Awaited<A>) => B,
  fn3: (arg: Awaited<PipeReturn<A, B>>) => C,
): (...args: Args) => PipeReturn<PipeReturn<A, B>, C>;
export default function pipe<Args extends unknown[], A, B, C, D>(
  fn1: (...args: Args) => A,
  fn2: (arg: Awaited<A>) => B,
  fn3: (arg: Awaited<PipeReturn<A, B>>) => C,
  fn4: (arg: Awaited<PipeReturn<PipeReturn<A, B>, C>>) => D,
): (...args: Args) => PipeReturn<PipeReturn<PipeReturn<A, B>, C>, D>;
export default function pipe<Args extends unknown[], A, B, C, D, E>(
  fn1: (...args: Args) => A,
  fn2: (arg: Awaited<A>) => B,
  fn3: (arg: Awaited<PipeReturn<A, B>>) => C,
  fn4: (arg: Awaited<PipeReturn<PipeReturn<A, B>, C>>) => D,
  fn5: (arg: Awaited<PipeReturn<PipeReturn<PipeReturn<A, B>, C>, D>>) => E,
): (
  ...args: Args
) => PipeReturn<PipeReturn<PipeReturn<PipeReturn<A, B>, C>, D>, E>;
export default function pipe(...fns: AnyFunc[]): AnyFunc;
export default function pipe(...fns: AnyFunc[]): AnyFunc {
  return (...args) => {
    if (fns.length === 0) return;

    const [firstFn, ...restFns] = fns;
    let res = firstFn(...args);

    for (let i = 0; i < restFns.length; i++) {
      if (res instanceof Promise) {
        return (async () => {
          for (let j = i; j < restFns.length; j++) {
            res = await restFns[j](await (res as MaybePromise<unknown>));
          }
          return res;
        })();
      }
      res = restFns[i](res);
    }

    return res;
  };
}
