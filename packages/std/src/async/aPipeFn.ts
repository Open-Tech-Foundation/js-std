/** Returns a function that performs functions composition from left to right asynchronously.
 *
 * @example
 * const transform = aPipe((x) => Promise.resolve(x ** 2), (x) => Promise.resolve(x - 5))
 * await transform(5) //=> 20
 */
export default function aPipeFn(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  return async function (...args) {
    const firstFn = fns.shift();

    if (!firstFn) {
      return;
    }

    let out = await firstFn(...args);

    for (const fn of fns) {
      out = await fn(out);
    }

    return out;
  };
}
