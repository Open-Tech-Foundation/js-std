/** Performs functions composition from left to right.
 *
 * @example
 *
 * pipe(1, (x) => x + 1, (x) => x * 5) //=> 10
 */
export default function pipe(
  val: unknown,
  ...fns: ((...args: unknown[]) => unknown)[]
): unknown {
  let out = val;

  for (const fn of fns) {
    out = fn(out);
  }

  return out;
}
