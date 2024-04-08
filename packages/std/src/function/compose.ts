import reverse from '../array/reverse';

/** Performs functions composition from right to left.
 *
 * @example
 *
 * compose(1, (x) => x + 1, (x) => x * 5) //=> 6
 */
export default function compose(
  val: unknown,
  ...fns: ((...args: unknown[]) => unknown)[]
): unknown {
  let out = val;

  for (const fn of reverse(fns)) {
    out = fn(out);
  }

  return out;
}
