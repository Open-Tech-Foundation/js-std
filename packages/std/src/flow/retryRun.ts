import validateFlowNumber from './validateFlowNumber';

/**
 * The most retries a single call will make.
 *
 * `Number.isInteger` is true of `1e308`, so a retry count taken from
 * configuration passed validation and then drove a loop that never ended. With
 * no delay there is no timer in that loop either, only awaited promises, so it
 * starves the event loop rather than merely running long: no timer fires, no
 * socket is read, and the process stops responding altogether. A timer set
 * before such a call was still unfired twenty seconds later.
 *
 * Retries are a handful in practice, so the limit is far above real use and
 * exists to keep a misconfiguration from wedging a process.
 */
export const MAX_RETRIES = 1000;

export interface RetryRunOptions {
  /** How many times to retry after the first attempt fails. Defaults to `3`, and must not exceed `MAX_RETRIES`. */
  retries?: number;
  /** The delay between attempts, in milliseconds. Defaults to `0`. */
  delay?: number;
  /** Whether `delay` stays constant or doubles each attempt. Defaults to `'fixed'`. */
  backoff?: 'fixed' | 'exponential';
  /**
   * Called before each retry with the error that caused it. The error is
   * `unknown` because a rejection can carry any value, not just an `Error`.
   */
  onRetry?: (error: unknown, attempt: number) => void;
}

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
  options: RetryRunOptions = {},
): Promise<T> {
  const { retries = 3, delay = 0, backoff = 'fixed', onRetry } = options;

  validateFlowNumber(retries, 'Retries', {
    integer: true,
    min: 0,
    max: MAX_RETRIES,
  });
  validateFlowNumber(delay, 'Delay', { min: 0 });
  if (backoff !== 'fixed' && backoff !== 'exponential') {
    throw new RangeError("Backoff must be either 'fixed' or 'exponential'.");
  }

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
