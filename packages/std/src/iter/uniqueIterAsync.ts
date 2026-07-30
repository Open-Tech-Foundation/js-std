import isEql from '../assert/isEql';
import isFunction from '../types/isFunction';

/**
 * Returns an AsyncGenerator that yields each item the first time it is seen.
 *
 * Items come through as they are read, so an early duplicate-free prefix is
 * available before the stream ends — but the keys seen so far are held, and
 * that set only grows. On an endless stream of distinct values it grows
 * without limit, as any deduplication must.
 *
 * Primitive keys are matched by identity, so `NaN` equals `NaN` and `-0`
 * equals `0`. Object keys are compared structurally with `isEql`, matching
 * `unique`, and against every distinct object seen so far — quadratic in the
 * number of them, so prefer a `by` that returns a primitive.
 *
 * @param {AsyncIterable<T>} iterable The source async iterable.
 * @param {Function} [by] The iteratee invoked per item to derive its key.
 * @returns {AsyncGenerator<T>} A new async generator without duplicates.
 *
 * @example
 * const ids = uniqueIterAsync(events, (e) => e.userId);
 * await toArrayIterAsync(ids) //=> one event per user, in first-seen order
 */
export default async function* uniqueIterAsync<T>(
  iterable: AsyncIterable<T>,
  by?: (val: T) => unknown | Promise<unknown>,
): AsyncGenerator<T> {
  const byFlag = isFunction(by);
  const primitives = new Set<unknown>();
  const objects: unknown[] = [];

  for await (const item of iterable) {
    const key = byFlag ? await by(item) : item;

    if (key === null || typeof key !== 'object') {
      if (primitives.has(key)) {
        continue;
      }
      primitives.add(key);
      yield item;
      continue;
    }

    let seen = false;
    for (const other of objects) {
      if (isEql(key, other)) {
        seen = true;
        break;
      }
    }

    if (!seen) {
      objects.push(key);
      yield item;
    }
  }
}
