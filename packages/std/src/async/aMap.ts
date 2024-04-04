/**
 *  Array map with `Async` callback function.
 *
 * @example
 * await aMap([1, 2, 3], (n) => await someDelayedFn(n))
 */
export default async function aMap<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<unknown>
): Promise<unknown[]> {
  let i = 0;
  const out: unknown[] = [];

  for (const e of arr) {
    out.push(await cb(e, i));
    i++;
  }

  return out;
}
