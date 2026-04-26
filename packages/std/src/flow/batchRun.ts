/**
 * Creates a batched function that collects calls and processes them in groups.
 *
 * @example
 * const batchFetch = batchRun(async (batch) => {
 *   // batch is an array of arguments: [[1], [2], [3]]
 *   return await fetchUsers(batch.map(args => args[0]));
 * }, { limit: 10, delay: 50 });
 *
 * const user1 = batchFetch(1);
 * const user2 = batchFetch(2);
 */
export default function batchRun<T extends any[], R>(
  batchProcessor: (argsList: T[]) => Promise<R[]>,
  options: {
    limit?: number;
    delay?: number;
  } = {}
): (...args: T) => Promise<R> {
  const limit = options.limit ?? Infinity;
  const delay = options.delay ?? 0;

  let queue: { args: T; resolve: (val: R) => void; reject: (err: any) => void }[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  async function processQueue() {
    const currentQueue = queue;
    queue = [];
    clearTimeout(timeoutId);
    timeoutId = undefined;

    try {
      const results = await batchProcessor(currentQueue.map((item) => item.args));
      currentQueue.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      currentQueue.forEach((item) => item.reject(error));
    }
  }

  return function (...args: T): Promise<R> {
    return new Promise((resolve, reject) => {
      queue.push({ args, resolve, reject });

      if (queue.length >= limit) {
        processQueue();
      } else if (timeoutId === undefined) {
        timeoutId = setTimeout(processQueue, delay);
      }
    });
  };
}
