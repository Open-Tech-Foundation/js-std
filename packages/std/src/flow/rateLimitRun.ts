import withResolvers from '../concurrency/withResolvers';

/**
 * Creates a rate-limited function that ensures it only runs a specific number of times
 * within a rolling time window.
 *
 * @example
 * const run = rateLimitRun(async (val) => val, 2, 1000); // 2 per second
 * run('a'); // runs immediately
 * run('b'); // runs immediately
 * run('c'); // waits until 1s after 'a' started
 */
export default function rateLimitRun<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  period: number,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const timestamps: number[] = [];
  const queue: {
    args: Parameters<T>;
    resolve: (val: any) => void;
    reject: (err: any) => void;
  }[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function cleanup() {
    const now = Date.now();
    while (timestamps.length > 0 && timestamps[0] <= now - period) {
      timestamps.shift();
    }
  }

  async function processQueue() {
    timeoutId = undefined;
    cleanup();

    while (queue.length > 0 && timestamps.length < limit) {
      const item = queue.shift()!;
      const now = Date.now();
      timestamps.push(now);

      try {
        const result = await func(...item.args);
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }

      cleanup();
    }

    if (queue.length > 0 && timeoutId === undefined) {
      const nextExecutionTime = timestamps[0] + period;
      const delay = Math.max(0, nextExecutionTime - Date.now());
      timeoutId = setTimeout(processQueue, delay);
    }
  }

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const { promise, resolve, reject } = withResolvers<ReturnType<T>>();
    queue.push({ args, resolve, reject });
    processQueue();
    return promise;
  };
}
