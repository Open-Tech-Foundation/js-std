import isFunction from '../types/isFunction';
import createSeenSet from './createSeenSet';

/**
 * Creates a duplicate-free version of an array, keeping first-seen order.
 *
 * Primitive values are matched by identity, so `NaN` equals `NaN` and `-0`
 * equals `0`. Objects are compared structurally, so two separately built
 * objects of the same shape count as one — that comparison is quadratic in the
 * number of distinct objects, so pass a `by` returning a primitive when the
 * array is large.
 *
 * How two values are compared depends on the values, not on whether `by` was
 * given: the same array deduplicates the same way with an identity iteratee as
 * without one.
 *
 * @param {T[]} arr The source array.
 * @param {Function} [by] The iteratee invoked per element to derive its key.
 * @returns {T[]} A new duplicate-free array.
 *
 * @example
 * unique([1, 2, 2, 3]) //=> [1, 2, 3]
 *
 * @example
 * unique([{ a: 1 }, { a: 1 }]) //=> [{ a: 1 }]
 *
 * @example
 * const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
 * unique(users, (u) => u.id) //=> [{ id: 1 }, { id: 2 }]
 */
export default function unique<T>(
  arr: T[] = [],
  by?: (val: T) => unknown,
): T[] {
  if (arr.length === 0) {
    return [];
  }

  const byFlag = isFunction(by);

  // Nothing to derive and nothing to compare structurally, so the whole thing
  // is one pass through a Set.
  if (!byFlag && arr.every((x) => typeof x !== 'object' || x === null)) {
    return [...new Set(arr)];
  }

  const isFirstSeen = createSeenSet();
  const result: T[] = [];

  for (const item of arr) {
    // Once per element. The previous implementation re-derived the key of
    // every element already kept, on every element.
    if (isFirstSeen(byFlag ? by(item) : item)) {
      result.push(item);
    }
  }

  return result;
}
