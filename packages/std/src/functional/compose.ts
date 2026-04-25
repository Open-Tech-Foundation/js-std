import reverse from '../array/reverse';

/** Returns a function that performs functions composition from right to left.
 * Supports both synchronous and asynchronous functions.
 * If any function in the chain returns a Promise, the remaining chain is awaited.
 *
 * @example
 * const transform = compose(Math.abs, (x, y) => x + y);
 * transform(-2, -3) //=> 5
 */
export default function compose(
  ...fns: ((...args: any[]) => any)[]
): (...args: any[]) => any {
  return (...args) => {
    if (fns.length === 0) return;

    const [firstFn, ...restFns] = reverse(fns) as ((...args: any[]) => any)[];
    let res = firstFn(...args);

    for (let i = 0; i < restFns.length; i++) {
      if (res instanceof Promise) {
        return (async () => {
          for (let j = i; j < restFns.length; j++) {
            res = await restFns[j](await res);
          }
          return res;
        })();
      }
      res = restFns[i](res);
    }

    return res;
  };
}
