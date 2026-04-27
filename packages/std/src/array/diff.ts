import isEql from '../assert/isEql';
import isFunction from '../types/isFunction';

/**
 * Creates an array with the values of the first array not included in the other arrays.
 *
 * @param {unknown[][]} collections The arrays to compare.
 * @param {Function} by The iteratee invoked per element.
 * @returns {unknown[]} A new array of filtered values.
 *
 * @example
 * diff([[1, 2], [2, 3]]) //=> [1]
 * diff([[1, "a"], [1, 2]]) //=> ['a']
 */
export default function diff(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown,
): unknown[] {
  if (collections.length === 0) {
    return [];
  }

  const first = collections[0] || [];
  if (collections.length === 1) {
    return [...first];
  }

  const others = collections.slice(1);
  const byFlag = isFunction(by);

  return first.filter((val) => {
    const v1 = byFlag ? by(val) : val;

    // Check if v1 exists in any of the other collections
    return !others.some((other) =>
      other.some((otherVal) => {
        const v2 = byFlag ? by(otherVal) : otherVal;
        return isEql(v1, v2);
      }),
    );
  });
}
