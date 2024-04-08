import reverse from '../array/reverse';

/** Returns a function that performs functions composition from right to left.
 *
 * @example
 * const transform = composeFn(Math.abs, Math.pow);
 * transform(-2, 3) //=> 8
 */
export default function composeFn(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  return function (...args) {
    const revFns = reverse(fns);

    const firstFn = revFns.shift();

    if (!firstFn) {
      return;
    }

    let out = firstFn(...args);

    for (const fn of revFns) {
      out = fn(out);
    }

    return out;
  };
}
