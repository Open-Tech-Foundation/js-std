/**
 * Stops waiting on a promise once a signal aborts.
 *
 * This settles the promise you get back — it does **not** cancel the underlying
 * work, because a promise has no cancel. The original operation keeps running
 * to completion; you simply stop awaiting its result. Pass the signal into the
 * operation itself (as `fetch` accepts one) when the work must actually stop.
 *
 * A rejection arriving from the original promise after an abort is swallowed
 * rather than surfacing as an unhandled rejection, since nothing is listening
 * for it by then.
 *
 * @param {Promise<T>} promise The promise to wait on.
 * @param {AbortSignal} signal The signal that stops the wait.
 * @returns {Promise<T>} A promise settling with `promise`, or rejecting on abort.
 * @throws Rejects with `signal.reason` if the signal is aborted first.
 *
 * @example
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 100);
 * await abortable(slowOperation(), controller.signal); // rejects after 100ms
 */
export default function abortable<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  if (signal.aborted) {
    // Nothing will observe the original rejection once we reject here.
    promise.catch(() => {});

    return Promise.reject(signal.reason);
  }

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      promise.catch(() => {});
      reject(signal.reason);
    };

    signal.addEventListener('abort', onAbort, { once: true });

    promise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}
