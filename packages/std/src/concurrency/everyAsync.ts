import validateConcurrency from './validateConcurrency';

/**
 * Asynchronous version of `Array.prototype.every`.
 * By default, it runs all iterations in parallel.
 *
 * Once an element fails the predicate no further ones are started, though
 * those already running are awaited — there is no way to recall work already
 * handed to the callback. Sparse holes are skipped, as `Array.prototype.every`
 * skips them, and an empty array is vacuously `true`.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async predicate to run for each element.
 * @param {number} [concurrency=Infinity] The maximum number of concurrent executions.
 * @returns {Promise<boolean>} Whether every element satisfied the predicate.
 *
 * @example
 * await everyAsync([2, 4, 6], async (n) => n % 2 === 0) //=> true
 *
 * @example
 * await everyAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> false
 */
export default async function everyAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<boolean>,
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<boolean> {
  validateConcurrency(concurrency);

  let index = 0;
  let failed = false;

  let hasError = false;
  let error: unknown;

  const worker = async () => {
    while (index < arr.length && !failed && !hasError) {
      const i = index++;
      if (!Object.hasOwn(arr, i)) {
        continue;
      }
      try {
        if (!(await cb(arr[i], i))) {
          failed = true;
        }
      } catch (err) {
        hasError = true;
        error = err;
      }
    }
  };

  const workers = [];
  const count = Math.min(concurrency, arr.length);
  for (let i = 0; i < count; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  if (hasError) {
    throw error;
  }

  return !failed;
}
