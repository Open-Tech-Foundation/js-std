import reverse from '../array/reverse';

/** Performs functions composition from right to left asynchronously.
 *
 * @example
 *
 * await aCompose(1, (x) => Promise.resolve(x + 1), (x) => Promise.resolve(x * 5)) //=> 6
 */
export default async function aCompose(
  val: unknown,
  ...fns: ((...args: unknown[]) => unknown)[]
): Promise<unknown> {
  let out = val;

  for (const fn of reverse(fns)) {
    out = await fn(out);
  }

  return out;
}
