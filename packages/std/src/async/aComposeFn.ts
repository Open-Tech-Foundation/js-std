import reverse from '../array/reverse';

/** Returns a function that performs functions composition from right to left asynchronously.
 *
 * @example
 * const transform = aComposeFn((x) => Promise.resolve(x + 1), (x) => Promise.resolve(x * 5))
 * await transform(1) //=> 6
 */
export default function aComposeFn(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  return async function (...args) {
    const revFns = reverse(fns);
    const firstFn = revFns.shift();

    if (!firstFn) {
      return;
    }

    let out = await firstFn(...args);

    for (const fn of revFns) {
      out = await fn(out);
    }

    return out;
  };
}
