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
    while (startIdx < arr.length && !Object.hasOwn(arr, startIdx)) {
      startIdx += 1;
    }

    if (startIdx >= arr.length) {
      throw new TypeError('Reduce of empty array with no initial value');
    }

    acc = arr[startIdx] as unknown as R;
    startIdx += 1;
  }

  for (let i = startIdx; i < arr.length; i++) {
    if (!Object.hasOwn(arr, i)) {
      continue;
    }
    acc = await cb(acc, arr[i], i);
  }

  return acc;
}
