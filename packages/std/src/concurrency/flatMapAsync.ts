import mapAsync from './mapAsync';
import {
  getConcurrency,
  type ConcurrencyOptions,
} from './concurrencyOptions';

/**
 * Asynchronous version of `Array.prototype.flatMap`.
 * By default, it runs all iterations in parallel.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async mapping callback to run for each element.
 * @param {ConcurrencyOptions} [options] The maximum number of concurrent executions.
 * @returns {Promise<R[]>} The flattened mapped values.
 *
 * @example
 * await flatMapAsync([1, 2, 3], async (n) => [n, n * 2]) //=> [1, 2, 2, 4, 3, 6]
 * await flatMapAsync([1, 2, 3], async (n) => [n, n * 2], { concurrency: 2 }) //=> [1, 2, 2, 4, 3, 6]
 */
export default async function flatMapAsync<T, R>(
  arr: T[],
  cb: (value: T, index: number) => R | readonly R[] | Promise<R | readonly R[]>,
  options: ConcurrencyOptions = {},
): Promise<R[]> {
  const concurrency = getConcurrency(options);
  const results = await mapAsync(arr, cb, { concurrency });
  return results.flat() as R[];
}
