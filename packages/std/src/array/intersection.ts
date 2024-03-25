import isEql from '../assert/isEql';
import isFn from '../types/isFn';
import uniq from './uniq';

/**
 * Returns a unique array of values only containing elements from each of the collections.
 *
 * @example
 *
 * const setA = [1, 2, 3, 4];
 * const setB = [3, 5];
 * intersection(setA, setB) //=> [3]
 */
export default function intersection(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown
) {
  const byFlag = isFn(by);
  const out = collections.reduce((acc, cur) => {
    const _intersection = [];
    for (const val of acc) {
      for (const val2 of cur) {
        const v1 = byFlag ? by(val) : val;
        const v2 = byFlag ? by(val2) : val2;
        if (isEql(v1, v2)) {
          _intersection.push(val);
        }
      }
    }
    return _intersection;
  });

  return uniq(out);
}
