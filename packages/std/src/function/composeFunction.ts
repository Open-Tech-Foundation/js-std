import reverse from '../array/reverse';

/** Returns a function that performs functions composition from right to left.
 *
 * @example
 * const transform = composeFunction(Math.abs, Math.pow);
 * transform(-2, 3) //=> 8
 */
export default function composeFunction(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  return (...args) => {
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
