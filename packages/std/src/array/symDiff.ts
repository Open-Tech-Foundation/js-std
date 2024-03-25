import isEql from '../assert/isEql';
import isFn from '../types/isFn';
import uniq from './uniq';

/**
 *  Returns a new array containing elements which are in either this or other, but not in both.
 *
 * @example
 *
 * const evens = [2, 4, 6, 8];
 * const squares = [1, 4, 9];
 * symDiff([evens, squares]); // [2, 6, 8, 1, 9]
 */
export default function symDiff(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown
) {
  const byFlag = isFn(by);
  const out = collections.slice(1).reduce(
    (acc, cur) => {
      const removeIdxs: number[] = [];
      for (const curVal of cur) {
        let flag = true;
        let idx = 0;
        for (const accVal of acc) {
          const v1 = byFlag ? by(curVal) : curVal;
          const v2 = byFlag ? by(accVal) : accVal;
          if (isEql(v1, v2)) {
            removeIdxs.push(idx);
            flag = false;
          }
          idx += 1;
        }

        if (flag) {
          acc.push(curVal);
        }
      }

      return acc.filter((_item, i) => !removeIdxs.includes(i));
    },
    [...(collections[0] || [])]
  );

  return uniq(out);
}
