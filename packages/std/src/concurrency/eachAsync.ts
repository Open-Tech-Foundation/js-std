/**
 * Asynchronous version of `Array.prototype.forEach`.
 * By default, it runs all iterations in parallel.
 *
 * @example
 * await eachAsync([1, 2, 3], async (n) => console.log(n))
 */
export default async function eachAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<void>,
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<void> {
  let index = 0;
  let aborted = false;

  const worker = async () => {
    try {
      while (index < arr.length && !aborted) {
        const i = index++;
        if (i >= arr.length) break;
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
