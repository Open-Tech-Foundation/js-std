import sleep from '../timing/sleep';
import validateFlowNumber from './validateFlowNumber';

export interface PollRunOptions<T> {
  /**
   * Decides whether polling is done. Receives what `fn` returned and the
   * one-based attempt number, and may be async.
   */
  until: (value: T, attempt: number) => boolean | Promise<boolean>;
  /** How long to wait between attempts, in milliseconds. Defaults to `100`. */
  interval?: number;
  /** Whether `interval` stays constant or doubles each attempt. Defaults to `'fixed'`. */
  backoff?: 'fixed' | 'exponential';
  /** The most attempts to make. Defaults to `Infinity`. */
  attempts?: number;
  /** The longest to keep polling, in milliseconds. Defaults to `Infinity`. */
  timeout?: number;
  /** Aborting this signal rejects the poll and stops the pending wait. */
  signal?: AbortSignal;
}

/**
 * Runs an asynchronous function repeatedly until its result satisfies a
 * condition, then resolves with that result.
 *
 * This is waiting for something to become true: a job to leave `'pending'`, a
 * container to report healthy, a file to appear, a deployment to go live. The
 * shape is always the same — ask, check, wait, ask again — and writing it by
 * hand means writing the timeout and the give-up path by hand each time.
 *
 * It is the opposite of `retryRun`, which repeats on **failure**. Here a
 * successful call whose result is not yet what was wanted is the reason to go
 * round again, and an error is not: a poll that throws rejects immediately
 * rather than being swallowed, since a failing call is a real failure and not a
 * `false` in disguise. Compose the two — `pollRun(() => retryRun(check), …)` —
 * where a call may fail transiently and still be worth polling.
 *
 * The first attempt runs immediately, so a condition that already holds costs
 * one call and no waiting.
 *
 * `timeout` bounds the whole operation, not one attempt, and holds even while
 * `fn` itself is running — a slow call cannot overrun it. As with any timeout
 * on a promise, the call in flight is not cancelled, because a promise has no
 * cancel; polling simply stops. Pass `signal` through to the work itself where
 * it must actually stop.
 *
 * @param {Function} fn The function to poll. May be sync or async.
 * @param {PollRunOptions<T>} options The polling options. `until` is required.
 * @returns {Promise<T>} The first result that satisfied `until`.
 * @throws {Error} If the attempts or the timeout run out first.
 * @throws Rejects with `signal.reason` if the signal is aborted.
 * @throws Rejects with whatever `fn` threw, immediately.
 *
 * @example
 * const job = await pollRun(() => getJob(id), {
 *   until: (job) => job.status !== 'pending',
 *   interval: 1000,
 *   timeout: 30_000,
 * });
 *
 * @example
 * // Backing off rather than asking at a fixed rate
 * await pollRun(() => ping(), {
 *   until: (ok) => ok,
 *   interval: 100,
 *   backoff: 'exponential',
 *   attempts: 8,
 * });
 */
export default function pollRun<T>(
  fn: () => T | Promise<T>,
  options: PollRunOptions<T>,
): Promise<T> {
  const {
    until,
    interval = 100,
    backoff = 'fixed',
    attempts = Number.POSITIVE_INFINITY,
    timeout = Number.POSITIVE_INFINITY,
    signal,
  } = options ?? {};

  if (typeof until !== 'function') {
    throw new TypeError('pollRun: an `until` condition is required.');
  }

  validateFlowNumber(interval, 'Interval', { min: 0 });
  validateFlowNumber(attempts, 'Attempts', {
    integer: true,
    min: 1,
    allowInfinity: true,
  });
  validateFlowNumber(timeout, 'Timeout', { min: 0, allowInfinity: true });

  if (backoff !== 'fixed' && backoff !== 'exponential') {
    throw new RangeError("Backoff must be either 'fixed' or 'exponential'.");
  }

  // Wakes the pending `sleep` once the race is decided, so a poll that has
  // already given up does not hold a timer open until the next interval.
  const stopWaiting = new AbortController();

  const loop = async (): Promise<T> => {
    for (let attempt = 1; ; attempt++) {
      const value = await fn();

      if (await until(value, attempt)) {
        return value;
      }

      if (attempt >= attempts) {
        throw new Error(
          `pollRun: the condition was not met after ${attempts} attempts.`,
        );
      }

      const wait =
        backoff === 'exponential' ? interval * 2 ** (attempt - 1) : interval;

      await sleep(wait, { signal: stopWaiting.signal });
    }
  };

  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  const races: Promise<never>[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;

  if (timeout !== Number.POSITIVE_INFINITY) {
    races.push(
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `pollRun: the condition was not met within ${timeout}ms.`,
            ),
          );
        }, timeout);
      }),
    );
  }

  if (signal) {
    races.push(
      new Promise<never>((_resolve, reject) => {
        onAbort = () => reject(signal.reason);
        signal.addEventListener('abort', onAbort, { once: true });
      }),
    );
  }

  const polling = loop();

  // Once the race is lost nothing observes the loop, and aborting its wait
  // below would otherwise surface as an unhandled rejection.
  polling.catch(() => {});

  return Promise.race([polling, ...races]).finally(() => {
    clearTimeout(timer);
    stopWaiting.abort();

    // A caller may hold one signal across many polls; leaving a listener on it
    // each time is a leak that grows with the number of calls.
    if (onAbort) {
      signal?.removeEventListener('abort', onAbort);
    }
  });
}
