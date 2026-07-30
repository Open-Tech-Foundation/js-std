import validateConcurrency from './validateConcurrency';

/**
 * Asynchronous version of `Array.prototype.find`.
 * By default, it runs all iterations in parallel.
 *
 * The result is the earliest match by index, not the first predicate to
 * resolve. Those are the same thing only when running one at a time: with
 * several in flight a later element can settle first, and returning it would
 * make the answer depend on how fast each callback happened to be.
 *
 * Elements at or beyond a known match are never started, since they cannot
 * improve on it, but everything before one is awaited — any of those could
 * still turn out to be the earlier match. Holes are visited and seen as
 * `undefined`, as `Array.prototype.find` visits them.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async predicate to run for each element.
 * @param {number} [concurrency=Infinity] The maximum number of concurrent executions.
 * @returns {Promise<T|undefined>} The first matching element, or `undefined`.
 *
 * @example
 * await findAsync([1, 2, 3], async (n) => n > 1) //=> 2
 *
 * @example
 * await findAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> 'https://…'
 */
export default async function findAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => boolean | Promise<boolean>,
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<T | undefined> {
  validateConcurrency(concurrency);

  let index = 0;
  // The lowest index known to match. Workers hand out indices in order, so
  // every index below this one has already been started, and anything not yet
  // started is above it and cannot win.
  let matchIndex = Number.POSITIVE_INFINITY;

  let hasError = false;
  let error: unknown;

  const worker = async () => {
    while (index < arr.length && index < matchIndex && !hasError) {
      const i = index++;
      try {
        if ((await cb(arr[i], i)) && i < matchIndex) {
          matchIndex = i;
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

  return matchIndex === Number.POSITIVE_INFINITY ? undefined : arr[matchIndex];
}
