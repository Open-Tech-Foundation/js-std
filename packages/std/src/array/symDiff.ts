import isEql from '../assert/isEql';
import isFunction from '../types/isFunction';
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
  by?: (val: unknown) => unknown,
): unknown[] {
  if (collections.length === 0) {
    return [];
  }

  if (collections.length === 1) {
    return uniq(collections[0], by);
  }

  const byFlag = isFunction(by);

  const out = collections.reduce((acc, cur) => {
    const result = [...acc, ...cur];

    return result.filter((val) => {
      const v1 = byFlag ? by(val) : val;

      const inAcc = acc.some((a) => {
        const v2 = byFlag ? by(a) : a;
        return isEql(v1, v2);
      });

      const inCur = cur.some((c) => {
        const v2 = byFlag ? by(c) : c;
        return isEql(v1, v2);
      });

      return !(inAcc && inCur);
    });
  });

  return uniq(out, by);
}
