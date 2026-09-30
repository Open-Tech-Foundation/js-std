import validateConcurrency from './validateConcurrency';
import {
  getConcurrency,
  type ConcurrencyOptions,
} from './concurrencyOptions';

/**
 * Asynchronous version of `Array.prototype.forEach`.
 * By default, it runs all iterations in parallel.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async callback to run for each element.
 * @param {ConcurrencyOptions} [options] The maximum number of concurrent executions.
 * @returns {Promise<void>} Resolves when all callbacks complete.
 *
 * @example
 * await eachAsync([1, 2, 3], async (n) => console.log(n))
 * await eachAsync([1, 2, 3], async (n) => console.log(n), { concurrency: 2 })
 */
export default async function eachAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => void | Promise<void>,
  options: ConcurrencyOptions = {},
): Promise<void> {
  const concurrency = getConcurrency(options);
  validateConcurrency(concurrency);

  let index = 0;
  let aborted = false;

  const worker = async () => {
    try {
      while (index < arr.length && !aborted) {
        const i = index++;
        if (i >= arr.length) break;
        if (!Object.hasOwn(arr, i)) continue;
        await cb(arr[i], i);
      }
    } catch (err) {
      aborted = true;
      throw err;
    }
  };

  const workers = [];
  const count = Math.min(concurrency, arr.length);
  for (let i = 0; i < count; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
}
