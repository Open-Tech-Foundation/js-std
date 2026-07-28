/**
 * Suspends execution for the given number of milliseconds.
 *
 * Passing a signal makes the sleep cancellable: aborting rejects the promise
 * with the signal's reason and clears the pending timer, so a cancelled sleep
 * does not hold the event loop open waiting to resolve something nobody is
 * listening for.
 *
 * @param {number} [ms=0] The number of milliseconds to sleep.
 * @param {{ signal?: AbortSignal }} [options] An optional abort signal.
 * @returns {Promise<void>} A promise that resolves after the given time.
 * @throws Rejects with `signal.reason` if the signal is aborted.
 *
 * @example
 * await sleep(1000)
 *
 * @example
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 100);
 * await sleep(5000, { signal: controller.signal }); // rejects after 100ms
 */
export default function sleep(
  ms = 0,
  options: { signal?: AbortSignal } = {},
): Promise<void> {
  const { signal } = options;

  // Already cancelled, so never start a timer at all.
  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
