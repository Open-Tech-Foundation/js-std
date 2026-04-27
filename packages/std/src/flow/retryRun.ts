/**
 * Retries an asynchronous function according to the specified options.
 *
 * @param {Function} func The async function to retry.
 * @param {Object} [options] The retry options.
 * @returns {Promise<T>} A promise that resolves to the function result.
 *
 * @example
 * const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
 */
export default async function retryRun<T>(
  func: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: 'fixed' | 'exponential';
    onRetry?: (error: any, attempt: number) => void;
  } = {},
): Promise<T> {
  const { retries = 3, delay = 0, backoff = 'fixed', onRetry } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // We use a wrapper to catch the error immediately and prevent unhandled rejection warnings
    // while still allowing us to handle the error in our logic.
    const result = await func().then(
      (val) => ({ ok: true as const, val }),
      (err) => ({ ok: false as const, err }),
    );

    if (result.ok) {
      return result.val;
    }

    lastError = result.err;
    if (attempt < retries) {
      onRetry?.(lastError, attempt + 1);

      let waitTime = delay;
      if (backoff === 'exponential' && delay > 0) {
        waitTime = delay * 2 ** attempt;
      }

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
