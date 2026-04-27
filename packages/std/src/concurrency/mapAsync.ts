/**
 * Asynchronous version of `Array.prototype.map`.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The async callback to run for each element.
 * @param {number} [concurrency=Infinity] The maximum number of concurrent executions.
 * @returns {Promise<R[]>} A promise that resolves to the new array.
 *
 * @example
 * await mapAsync([1, 2, 3], async (n) => n * 2) //=> [2, 4, 6]
 */
export default async function mapAsync<T, R>(
  arr: T[],
  cb: (value: T, index: number) => Promise<R>,
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<R[]> {
  const results: R[] = new Array(arr.length);
  let index = 0;

  const worker = async () => {
    while (index < arr.length) {
      const i = index++;
      results[i] = await cb(arr[i], i);
    }
  };

  const workers = [];
  const count = Math.min(concurrency, arr.length);
  for (let i = 0; i < count; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  return results;
}
