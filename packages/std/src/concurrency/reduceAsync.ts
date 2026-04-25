/**
 * Asynchronous version of `Array.prototype.reduce`.
 * Runs iterations sequentially as each step depends on the previous accumulator.
 *
 * @example
 * await reduceAsync([1, 2, 3], async (acc, n) => acc + n, 0) //=> 6
 */
export default async function reduceAsync<T, R>(
  arr: T[],
  cb: (accumulator: R, value: T, index: number) => Promise<R>,
  initialValue?: R,
): Promise<R> {
  let acc = initialValue as R;
  let startIdx = 0;

  if (initialValue === undefined) {
    if (arr.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    acc = arr[0] as unknown as R;
    startIdx = 1;
  }

  for (let i = startIdx; i < arr.length; i++) {
    acc = await cb(acc, arr[i], i);
  }

  return acc;
}
