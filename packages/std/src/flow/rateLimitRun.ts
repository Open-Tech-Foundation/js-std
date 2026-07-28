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
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new RangeError('Limit must be a positive integer.');
  }

  if (!Number.isFinite(period) || period <= 0) {
    throw new RangeError('Period must be a positive finite number.');
  }

  const timestamps: number[] = [];
  const queue: {
    args: Parameters<T>;
    resolve: (val: any) => void;
    reject: (err: any) => void;
  }[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  /** Drops start times that have aged out of the rolling window. */
  function cleanup(now: number) {
    while (timestamps.length > 0 && timestamps[0] <= now - period) {
      timestamps.shift();
    }
  }

  function processQueue() {
    while (queue.length > 0) {
      // Re-checked every iteration: a slow synchronous `func` can push the clock
      // past the window boundary part-way through a drain.
      cleanup(Date.now());
      if (timestamps.length >= limit) break;

      const item = queue.shift()!;
      timestamps.push(Date.now());

      // The window is measured from when a call *starts*, so settlement never
      // frees a slot and there is nothing to re-drain on completion.
      try {
        const result = func(...item.args);
        if (result && typeof result.then === 'function') {
          result.then(item.resolve, item.reject);
        } else {
          item.resolve(result);
        }
      } catch (error) {
        item.reject(error);
      }
    }

    if (queue.length > 0 && timeoutId === undefined) {
      // The oldest start time is the first slot to free up.
      const delay = Math.max(0, timestamps[0] + period - Date.now());
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        processQueue();
      }, delay);
    }
  }

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const { promise, resolve, reject } = withResolvers<ReturnType<T>>();
    queue.push({ args, resolve, reject });
    processQueue();
    return promise;
  };
}
