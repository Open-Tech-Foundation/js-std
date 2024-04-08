/** Returns a function that performs functions composition from left to right.
 *
 * @example
 * const transform = pipeFn(Math.pow, Math.abs)
 * transform(-2, 3) //=> 8
 */
export default function pipeFn(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  return function (...args) {
    const firstFn = fns.shift();

    if (!firstFn) {
      return;
    }

    let out = firstFn(...args);

    for (const fn of fns) {
      out = fn(out);
    }

    return out;
  };
}
