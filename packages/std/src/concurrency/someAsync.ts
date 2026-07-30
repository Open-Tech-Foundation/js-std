import validateConcurrency from './validateConcurrency';

/**
 * Asynchronous version of `Array.prototype.some`.
 * By default, it runs all iterations in parallel.
 *
 * Once an element satisfies the predicate no further ones are started, though
 * those already running are awaited — there is no way to recall work already
 * handed to the callback. Sparse holes are skipped, as `Array.prototype.some`
 * skips them.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async predicate to run for each element.
 * @param {number} [concurrency=Infinity] The maximum number of concurrent executions.
 * @returns {Promise<boolean>} Whether any element satisfied the predicate.
 *
 * @example
 * await someAsync([1, 2, 3], async (n) => n > 2) //=> true
 *
 * @example
 * await someAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> true
 */
export default async function someAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<boolean>,
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<boolean> {
  validateConcurrency(concurrency);

  let index = 0;
  let found = false;

  let hasError = false;
  let error: unknown;

  const worker = async () => {
    while (index < arr.length && !found && !hasError) {
      const i = index++;
      if (!Object.hasOwn(arr, i)) {
        continue;
      }
      try {
        if (await cb(arr[i], i)) {
          found = true;
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

  return found;
}
