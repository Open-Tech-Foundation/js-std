import isEql from '../assert/isEql';
import uniq from './uniq';

/**
 * Creates an array of unique values that are included in all given arrays.
 *
 * @example
 *
 * intersection([[1, 2, 3], [2, 3, 4]]) //=> [2, 3]
 * intersection([[2.1, 1.2], [2.3, 3.4]], Math.floor) //=> [2.1]
 */
export default function intersection<T>(
  arr: T[][],
  by?: (val: T) => unknown
): T[] {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }

  const collections = arr.filter((a) => Array.isArray(a));
  if (collections.length === 0) {
    return [];
  }

  const byFlag = typeof by === 'function';
  const [first, ...rest] = collections;
  
  const result = first.filter((val) => {
    const v1 = byFlag ? by(val) : val;
    return rest.every((c) => {
      return c.some((item) => {
        const v2 = byFlag ? by(item) : item;
        return isEql(v1, v2);
      });
    });
  });

  return uniq(result);
}
