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
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(options.message || `Operation timed out after ${ms}ms`));
    }, ms);
  });
  timeoutPromise.catch(() => {});

  try {
    if (options.fallback !== undefined) {
      return await Promise.race([
        func(),
        new Promise<T>((resolve) => {
          timeoutId = setTimeout(() => resolve(options.fallback!), ms);
        })
      ]);
    }
    
    return await Promise.race([func(), timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}
