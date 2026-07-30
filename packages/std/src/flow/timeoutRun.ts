import validateFlowNumber from './validateFlowNumber';

export interface TimeoutRunOptions<T> {
  /** The message of the error thrown when the time limit is reached. */
  message?: string;
  /** Resolve with this instead of throwing when the time limit is reached. */
  fallback?: T;
}

/**
 * Enforces a time limit on an asynchronous function.
 *
 * @param {Function} func The async function to run.
 * @param {number} ms The timeout in milliseconds.
 * @param {Object} [options] The timeout options.
 * @returns {Promise<T>} A promise that resolves to the function result.
 *
 * @example
 * const result = await timeoutRun(() => fetchLargeData(), 1000);
 */
export default async function timeoutRun<T>(
  func: () => Promise<T>,
  ms: number,
  options: TimeoutRunOptions<T> = {},
): Promise<T> {
  validateFlowNumber(ms, 'Timeout', { min: 0 });

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (options.fallback !== undefined) {
        resolve(options.fallback);
      } else {
        reject(
          new Error(options.message || `Operation timed out after ${ms}ms`),
        );
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
