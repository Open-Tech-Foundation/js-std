import mapAsync from './mapAsync';

/**
 * Asynchronous version of `Array.prototype.filter`.
 * By default, it runs all iterations in parallel.
 *
 * @example
 * await filterAsync([1, 2, 3], async (n) => n > 1) //=> [2, 3]
 */
export default async function filterAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<boolean>,
  concurrency: number = Infinity,
): Promise<T[]> {
  const mask = await mapAsync(arr, cb, concurrency);
  return arr.filter((_, i) => mask[i]);
}
