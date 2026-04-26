import mapAsync from './mapAsync';

/**
 * Asynchronous version of `Array.prototype.flatMap`.
 * By default, it runs all iterations in parallel.
 *
 * @example
 * await flatMapAsync([1, 2, 3], async (n) => [n, n * 2]) //=> [1, 2, 2, 4, 3, 6]
 */
export default async function flatMapAsync<T, R>(
  arr: T[],
  cb: (value: T, index: number) => Promise<R | readonly R[]>,
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<R[]> {
  const results = await mapAsync(arr, cb, concurrency);
  return results.flat() as R[];
}
