/**
 * Enforces a time limit on an asynchronous function.
 *
 * @example
 * try {
 *   const result = await timeoutRun(() => fetchLargeData(), 1000);
 * } catch (err) {
 *   // Rejects if it takes longer than 1s
 * }
 */
export default async function timeoutRun<T>(
  func: () => Promise<T>,
  ms: number,
  options: {
    message?: string;
    fallback?: T;
  } = {}
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (options.fallback !== undefined) {
        resolve(options.fallback);
      } else {
        reject(new Error(options.message || `Operation timed out after ${ms}ms`));
      }
    }, ms);
  });

  try {
    return await Promise.race([func(), timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
