/** Performs functions composition from left to right asynchronously.
 *
 * @example
 * await aPipe(5, (x) => Promise.resolve(x ** 2), (x) => Promise.resolve(x - 5)) //=> 20
 */
export default async function aPipe(
  val: unknown,
  ...fns: ((...args: unknown[]) => unknown)[]
): Promise<unknown> {
  let out = val;

  for (const fn of fns) {
    out = await fn(out);
  }

  return out;
}
