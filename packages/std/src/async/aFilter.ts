/**
 *  Array filter with `Async` callback function.
 *
 * @example
 *
 * const arr = [1, 2, 3]
 * aFilter(arr, (n) => isOdd(n)) //=> [1, 3]
 */
export default async function aFilter<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<boolean>
): Promise<Partial<T[]>> {
  let i = 0;
  const out = [];

  for (const e of arr) {
    if (await cb(e, i)) {
      out.push(e);
    }
    i++;
  }

  return out;
}
