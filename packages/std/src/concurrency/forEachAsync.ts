/**
 * Asynchronous version of `Array.prototype.forEach`.
 * By default, it runs all iterations in parallel.
 *
 * @example
 * await forEachAsync([1, 2, 3], async (n) => console.log(n))
 */
export default async function forEachAsync<T>(
  arr: T[],
  cb: (value: T, index: number) => Promise<void>,
  concurrency: number = Infinity,
): Promise<void> {
  let index = 0;

  const worker = async () => {
    while (index < arr.length) {
      const i = index++;
      await cb(arr[i], i);
    }
  };

  const workers = [];
  const count = Math.min(concurrency, arr.length);
  for (let i = 0; i < count; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
}
