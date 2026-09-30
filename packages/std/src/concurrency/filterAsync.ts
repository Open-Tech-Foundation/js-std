import { type ConcurrencyOptions, getConcurrency } from './concurrencyOptions';
import mapAsync from './mapAsync';

/**
 * Asynchronous version of `Array.prototype.filter`.
 * By default, it runs all iterations in parallel.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async predicate to run for each element.
 * @param {ConcurrencyOptions} [options] The maximum number of concurrent executions.
 * @returns {Promise<T[]>} The values that pass the predicate.
 *
 * @example
 * await filterAsync([1, 2, 3], async (n) => n > 1) //=> [2, 3]
 * await filterAsync([1, 2, 3], async (n) => n > 1, { concurrency: 2 }) //=> [2, 3]
 */
export default async function filterAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => boolean | Promise<boolean>,
  options: ConcurrencyOptions = {},
): Promise<T[]> {
  const concurrency = getConcurrency(options);
  const mask = await mapAsync(arr, cb, { concurrency });
  return arr.filter((_, i) => mask[i]);
}
