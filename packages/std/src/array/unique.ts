import isEql from '../assert/isEql';
import isFunction from '../types/isFunction';

/**
 * Creates a duplicate-free version of an array.
 *
 * @param {T[]} arr The source array.
 * @param {Function} by The iteratee invoked per element.
 * @returns {T[]} A new duplicate-free array.
 *
 * @example
 * unique([1, 2, 2, 3]) //=> [1, 2, 3]
 */

export default function unique<T>(
  arr: T[] = [],
  by?: (val: T) => unknown,
): T[] {
  if (arr.length === 0) {
    return [];
  }

  const byFlag = isFunction(by);

  // Optimization for primitives without iteratee
  if (!byFlag) {
    const primitivesOnly = arr.every(
      (x) => typeof x !== 'object' || x === null,
    );
    if (primitivesOnly) {
      return [...new Set(arr)];
    }
  }

  const result: T[] = [];
  for (const item of arr) {
    const v1 = byFlag ? by(item) : item;
    let isDuplicate = false;

    for (const resItem of result) {
      const v2 = byFlag ? by(resItem) : resItem;
      if (isEql(v1, v2)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      result.push(item);
    }
  }

  return result;
}
