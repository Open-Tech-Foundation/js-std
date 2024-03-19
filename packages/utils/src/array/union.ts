import isEql from '../assert/isEql';
import isFun from '../types/isFn';
import uniq from './uniq';

/**
 * Returns unique values in all the given collections.
 *
 * @example
 *
 * const setA = new Set([1, 2, 3, 4]);
 * const setB = new Set([2, 3, 5]);
 * const setC = new Set([2, 5, 3]);
 * union(setA, setB, setC) //=> [1, 2, 3, 4, 5]
 */
export default function union(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown
) {
  const byFlag = isFun(by);
  const out = collections.reduce((acc, cur) => {
    for (const val of cur) {
      let flag = false;
      for (const val2 of acc) {
        const v1 = byFlag ? by(val) : val;
        const v2 = byFlag ? by(val2) : val2;
        if (isEql(v1, v2)) {
          flag = true;
        }
      }
      if (!flag) {
        acc.push(val);
      }
    }

    return acc;
  }, []);

  return uniq(out);
}
