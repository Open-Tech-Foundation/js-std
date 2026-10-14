import sleep from '../timing/sleep';
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
  /**
   * Randomizes each wait by up to this fraction of the computed delay, as a
   * number from `0` (no jitter) to `1`. Defaults to `0`.
   *
   * Without jitter, clients that failed together retry at the same moment and
   * fail together again. With `jitter: 0.2`, a 1000ms wait becomes a uniform
   * random wait in `[800, 1200]`.
   */
  jitter?: number;
  /** Aborting this signal stops retrying and rejects with `signal.reason`. */
  signal?: AbortSignal;
  /**
   * Decides whether a failure is worth retrying. Receives the error and the
   * one-based number of the failed attempt, and may be async. Return `false`
   * to stop immediately and throw the error — for example, retry a `503` but
   * not a `400`. Defaults to retrying every error.
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean | Promise<boolean>;
  /**
   * When `true`, a `Retry-After` value carried by the error overrides a
   * shorter computed wait. Accepts seconds (`"120"`), HTTP dates
   * (`"Wed, 21 Oct 2015 07:28:00 GMT"`), a `retryAfter` property in seconds, a
   * `retryAfterMs` property in milliseconds, or the same value under a
   * `response` property (axios-style) or `headers` (a `Headers` instance, a
   * `Map`, an entries array, or a plain object, matched case-insensitively).
   * Unparseable values are ignored. Defaults to `false`.
   */
  respectRetryAfter?: boolean;
}

/** Reads a `Retry-After`-style value case-insensitively from headers. */
function getHeaderValue(headers: unknown, name: string): unknown {
  if (headers == null || typeof headers !== 'object') {
    return undefined;
  }

  const lower = name.toLowerCase();

  if (typeof (headers as { get?: unknown }).get === 'function') {
    try {
      const get = (headers as { get: (k: string) => unknown }).get.bind(
        headers,
      );
      const direct = get(name);
      if (direct != null) return direct;
      // `Headers.get` is case-insensitive already; a `Map` is not.
      if (lower !== name) {
        const folded = get(lower);
        if (folded != null) return folded;
      }
      // Fall through to key enumeration for Maps holding other casings.
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(headers)) {
    for (const entry of headers as unknown[]) {
      if (
        Array.isArray(entry) &&
        entry.length >= 2 &&
        String(entry[0]).toLowerCase() === lower
      ) {
        return entry[1];
      }
    }
    return undefined;
  }

  if (typeof (headers as Map<string, unknown>).keys === 'function') {
    try {
      for (const key of (headers as Map<string, unknown>).keys()) {
        if (String(key).toLowerCase() === lower) {
          return (headers as Map<string, unknown>).get(key);
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  for (const key of Object.keys(headers as Record<string, unknown>)) {
    if (key.toLowerCase() === lower) {
      return (headers as Record<string, unknown>)[key];
    }
  }
  return undefined;
}

/** Parses a `Retry-After` header value (seconds or HTTP date) to milliseconds. */
function parseRetryAfterHeader(value: unknown): number | undefined {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) return undefined;
    return value * 1000;
  }
  if (typeof value === 'string') {
    const text = value.trim();
    if (text === '') return undefined;
    if (/^[+-]?\d+(\.\d+)?$/.test(text)) {
      const seconds = Number(text);
      if (!Number.isFinite(seconds) || seconds < 0) return undefined;
      return seconds * 1000;
    }
    const time = Date.parse(text);
    if (!Number.isNaN(time)) {
      return Math.max(0, time - Date.now());
    }
  }
  return undefined;
}

function retryAfterFromSource(source: Record<string, any>): number | undefined {
  if (
    typeof source.retryAfterMs === 'number' &&
    Number.isFinite(source.retryAfterMs) &&
    source.retryAfterMs >= 0
  ) {
    return source.retryAfterMs;
  }

  const header = getHeaderValue(source.headers, 'retry-after');
  if (header != null) {
    const ms = parseRetryAfterHeader(header);
    if (ms !== undefined) return ms;
  }

  // A bare `retry-after` property outside `headers` (plain-object errors).
  if (
    source['retry-after'] != null &&
    (typeof source['retry-after'] === 'number' ||
      typeof source['retry-after'] === 'string')
  ) {
    const ms = parseRetryAfterHeader(source['retry-after']);
    if (ms !== undefined) return ms;
  }

  // A `retryAfter` property follows header semantics: seconds or a date.
  if (source.retryAfter != null) {
    if (
      typeof source.retryAfter === 'number' &&
      Number.isFinite(source.retryAfter) &&
      source.retryAfter >= 0
    ) {
      return source.retryAfter * 1000;
    }
    if (typeof source.retryAfter === 'string') {
      return parseRetryAfterHeader(source.retryAfter);
    }
  }

  return undefined;
}

/** Extracts a `Retry-After` wait in milliseconds from an error, if present. */
function getRetryAfterMs(error: unknown): number | undefined {
  if (error == null || typeof error !== 'object') return undefined;
  const err = error as Record<string, any>;
  const direct = retryAfterFromSource(err);
  if (direct !== undefined) return direct;
  const nested = (err as { response?: unknown }).response;
  if (nested != null && typeof nested === 'object' && nested !== err) {
    return retryAfterFromSource(nested as Record<string, any>);
  }
  return undefined;
}

/**
 * Retries an asynchronous function according to the specified options.
 *
 * The first attempt runs immediately. When it fails, `shouldRetry` decides
 * whether the error is retryable, `onRetry` observes the retry, and the wait
 * before the next attempt is the `backoff` delay randomized by `jitter` (or at
 * least the server's `Retry-After`, when `respectRetryAfter` is set).
 * Aborting `signal` stops the wait and rejects with `signal.reason`.
 *
 * @param {Function} func The async function to retry.
 * @param {Object} [options] The retry options.
 * @returns {Promise<T>} A promise that resolves to the function result.
 * @throws Rejects with `signal.reason` if the signal is aborted.
 * @throws Rejects with the last error once retries run out or `shouldRetry`
 * returns `false`.
 *
 * @example
 * const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
 *
 * @example
 * // Retry a 503 but not a 400, spreading retries with jitter
 * await retryRun(() => fetch('/api'), {
 *   retries: 5,
 *   delay: 1000,
 *   backoff: 'exponential',
 *   jitter: 0.2,
 *   shouldRetry: (error) => (error as Response).status !== 400,
 * });
 */
export default async function retryRun<T>(
  func: () => Promise<T>,
  options: RetryRunOptions = {},
): Promise<T> {
  const {
    retries = 3,
    delay = 0,
    backoff = 'fixed',
    onRetry,
    jitter = 0,
    signal,
    shouldRetry,
    respectRetryAfter = false,
  } = options;

  validateFlowNumber(retries, 'Retries', {
    integer: true,
    min: 0,
    max: MAX_RETRIES,
  });
  validateFlowNumber(delay, 'Delay', { min: 0 });
  if (backoff !== 'fixed' && backoff !== 'exponential') {
    throw new RangeError("Backoff must be either 'fixed' or 'exponential'.");
  }
  validateFlowNumber(jitter, 'Jitter', { min: 0, max: 1 });
  if (shouldRetry !== undefined && typeof shouldRetry !== 'function') {
    throw new TypeError('ShouldRetry must be a function.');
  }
  if (
    respectRetryAfter !== undefined &&
    typeof respectRetryAfter !== 'boolean'
  ) {
    throw new TypeError('RespectRetryAfter must be a boolean.');
  }
  if (onRetry !== undefined && typeof onRetry !== 'function') {
    throw new TypeError('OnRetry must be a function.');
  }

  if (signal?.aborted) {
    throw signal.reason;
  }

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (signal?.aborted) {
      throw signal.reason;
    }

    // We use a wrapper to catch the error immediately and prevent unhandled rejection warnings
    // while still allowing us to handle the error in our logic. The outer
    // try/catch also catches a synchronous throw from `func` itself.
    let result: { ok: true; val: T } | { ok: false; err: unknown };
    try {
      result = await func().then(
        (val) => ({ ok: true as const, val }),
        (err) => ({ ok: false as const, err }),
      );
    } catch (err) {
      result = { ok: false as const, err };
    }

    if (result.ok) {
      if (signal?.aborted) {
        throw signal.reason;
      }
      return result.val;
    }

    lastError = result.err;
    if (signal?.aborted) {
      throw signal.reason;
    }
    if (attempt >= retries) {
      break;
    }

    if (shouldRetry) {
      const retryable = await shouldRetry(lastError, attempt + 1);
      if (signal?.aborted) {
        throw signal.reason;
      }
      if (!retryable) {
        break;
      }
    }

    onRetry?.(lastError, attempt + 1);

    let waitTime = delay;
    if (backoff === 'exponential' && delay > 0) {
      waitTime = delay * 2 ** attempt;
    }

    if (jitter > 0 && waitTime > 0) {
      const spread = waitTime * jitter;
      waitTime = waitTime - spread + Math.random() * 2 * spread;
      if (waitTime < 0) waitTime = 0;
    }

    if (respectRetryAfter) {
      const retryAfterMs = getRetryAfterMs(lastError);
      if (retryAfterMs !== undefined) {
        waitTime = Math.max(waitTime, retryAfterMs);
      }
    }

    if (waitTime > 0) {
      await sleep(waitTime, signal ? { signal } : undefined);
    }
  }

  throw lastError;
}
