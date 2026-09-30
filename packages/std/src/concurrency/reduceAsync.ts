/** Options for {@link reduceAsync}. */
export interface ReduceAsyncOptions<R> {
  /**
   * The initial accumulator value. If omitted, the first present array item is
   * used.
   */
  initialValue?: R;
}

/**
 * Asynchronous version of `Array.prototype.reduce`.
 * Runs iterations sequentially as each step depends on the previous accumulator.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async reducer.
 * @param {ReduceAsyncOptions} [options] The initial accumulator value.
 * @returns {Promise<R>} The final accumulated value.
 *
 * @example
 * await reduceAsync([1, 2, 3], async (acc, n) => acc + n, { initialValue: 0 }) //=> 6
 */
export default async function reduceAsync<T, R>(
  arr: T[],
  cb: (accumulator: R, value: T, index: number) => R | Promise<R>,
  options: ReduceAsyncOptions<R> = {},
): Promise<R> {
  if (
    options === null ||
    typeof options !== 'object' ||
    Array.isArray(options)
  ) {
    throw new TypeError('Options must be an object.');
  }
  const { initialValue } = options;
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
