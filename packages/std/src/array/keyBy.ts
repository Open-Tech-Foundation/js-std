import isUnsafeKey from '../object/isUnsafeKey';
import isFunction from '../types/isFunction';

/**
 * Indexes an array by a key, giving one element per key.
 *
 * This is the one-to-one counterpart of `groupBy`, for turning a list into a
 * lookup table: `groupBy` collects every match into an array, `keyBy` keeps a
 * single element. When two elements produce the same key the later one wins,
 * so pass a list already ordered oldest-first to keep the newest.
 *
 * A key of `__proto__`, `constructor` or `prototype` is refused and its
 * element dropped: the lookup is built from data, and writing one of those
 * would make the element the prototype of the table instead of an entry in it.
 *
 * @param {T[]} arr The source array.
 * @param {Function|string} by The iteratee, or the name of a property to read.
 * @returns {Record<string, T>} The lookup table.
 *
 * @example
 * const users = [{ id: 'a1', name: 'Ada' }, { id: 'b2', name: 'Linus' }];
 * keyBy(users, 'id') //=> { a1: { id: 'a1', ... }, b2: { id: 'b2', ... } }
 *
 * @example
 * keyBy([6.1, 4.2], Math.floor) //=> { '4': 4.2, '6': 6.1 }
 */
export default function keyBy<T>(
  arr: T[] = [],
  by: ((val: T, index: number, arr: T[]) => string) | string,
): Record<string, T> {
  return arr.reduce((acc: Record<string, T>, cur, index, array) => {
    const key = String(
      isFunction(by) ? by(cur, index, array) : cur[by as keyof T],
    );

    if (isUnsafeKey(key)) {
      return acc;
    }

    acc[key] = cur;

    return acc;
  }, {});
}
