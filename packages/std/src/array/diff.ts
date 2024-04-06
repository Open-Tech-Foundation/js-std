import isEql from '../assert/isEql';
import isFn from '../types/isFn';

/**
 *  It creates an array with the values of first, not included in the other arrays.
 *
 * @example
 *
 * diff([[1, "a"], [1, 2]]); // ['a']
 */
export default function diff(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown
): unknown[] {
  const byFlag = isFn(by);
  return collections.slice(1).reduce(
    (acc, cur) => {
      const removeIdxs: number[] = [];
      for (const curVal of cur) {
        let idx = 0;
        for (const accVal of acc) {
          const v1 = byFlag ? by(curVal) : curVal;
          const v2 = byFlag ? by(accVal) : accVal;
          if (isEql(v1, v2)) {
            removeIdxs.push(idx);
          }

          idx += 1;
        }
      }

      return acc.filter((_item, i) => !removeIdxs.includes(i));
    },
    [...(collections[0] || [])]
  );
}
