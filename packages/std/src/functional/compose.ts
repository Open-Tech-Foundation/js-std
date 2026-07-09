import reverse from '../array/reverse';

type MaybePromise<T> = T | PromiseLike<T>;
type AnyFunc = (...args: any[]) => any;
type ComposeReturn<Prev, Next> = Prev extends PromiseLike<unknown>
  ? Promise<Awaited<Next>>
  : Next;

/** Returns a function that performs functions composition from right to left.
 * Supports both synchronous and asynchronous functions.
 * If any function in the chain returns a Promise, the remaining chain is awaited.
 *
 * @example
 * const transform = compose(Math.abs, (x, y) => x + y);
 * transform(-2, -3) //=> 5
 */
export default function compose<Args extends unknown[], A>(
  fn1: (...args: Args) => A,
): (...args: Args) => A;
export default function compose<Args extends unknown[], A, B>(
  fn2: (arg: Awaited<A>) => B,
  fn1: (...args: Args) => A,
): (...args: Args) => ComposeReturn<A, B>;
export default function compose<Args extends unknown[], A, B, C>(
  fn3: (arg: Awaited<ComposeReturn<A, B>>) => C,
  fn2: (arg: Awaited<A>) => B,
  fn1: (...args: Args) => A,
): (...args: Args) => ComposeReturn<ComposeReturn<A, B>, C>;
export default function compose<Args extends unknown[], A, B, C, D>(
  fn4: (arg: Awaited<ComposeReturn<ComposeReturn<A, B>, C>>) => D,
  fn3: (arg: Awaited<ComposeReturn<A, B>>) => C,
  fn2: (arg: Awaited<A>) => B,
  fn1: (...args: Args) => A,
): (...args: Args) => ComposeReturn<ComposeReturn<ComposeReturn<A, B>, C>, D>;
export default function compose<Args extends unknown[], A, B, C, D, E>(
  fn5: (
    arg: Awaited<ComposeReturn<ComposeReturn<ComposeReturn<A, B>, C>, D>>,
  ) => E,
  fn4: (arg: Awaited<ComposeReturn<ComposeReturn<A, B>, C>>) => D,
  fn3: (arg: Awaited<ComposeReturn<A, B>>) => C,
  fn2: (arg: Awaited<A>) => B,
  fn1: (...args: Args) => A,
): (
  ...args: Args
) => ComposeReturn<ComposeReturn<ComposeReturn<ComposeReturn<A, B>, C>, D>, E>;
export default function compose(...fns: AnyFunc[]): AnyFunc;
export default function compose(...fns: AnyFunc[]): AnyFunc {
  return (...args) => {
    if (fns.length === 0) return;

    const [firstFn, ...restFns] = reverse(fns) as AnyFunc[];
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
