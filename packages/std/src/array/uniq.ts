import isEql from '../assert/isEql';
import isFunction from '../types/isFunction';

/**
 * Creates a unique array by removing all duplicate values from the given array.
 *
 * @example
 *
 * uniq([1, 2, 2, 3]) //=> [1, 2, 3]
 */

export default function uniq<T>(arr: T[] = [], by?: (val: T) => unknown): T[] {
  if (arr.length === 0) {
    return [];
  }

  const byFlag = isFunction(by);

  // Optimization for primitives without iteratee
  if (!byFlag) {
    const primitivesOnly = arr.every(
      (x) => typeof x !== 'object' || x === null
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
