/**
 * Asynchronous version of `Array.prototype.map`.
 * By default, it runs all iterations in parallel.
 *
 * @example
 * await mapAsync([1, 2, 3], async (n) => n * 2) //=> [2, 4, 6]
 *
 * // With concurrency limit
 * await mapAsync(urls, fetchUrl, 5)
 */
export default async function mapAsync<T, R>(
  arr: T[],
  cb: (value: T, index: number) => Promise<R>,
  concurrency: number = Infinity,
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
