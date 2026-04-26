import size from '../object/size';
import isEql from './isEql';

/**
 * Checks deeply if the given two arrays with different orders are equivalent.
 *
 * @example
 *
 * isUnorderedEqual([1, 3, 2], [2, 1, 3]) //=> true
 *
 * isUnorderedEqual([1, 3, 2], [2, 1, 5]) //=> false
 */
export default function isUnorderedEqual(
  arr1: unknown[],
  arr2: unknown[],
): boolean {
  const a1 = arr1;
  const a2 = arr2.slice();

  if (a1.length !== a2.length) {
    return false;
  }

  // Handle sparse arrays: check if they have the same number of keys (non-holes)
  if (Object.keys(a1).length !== Object.keys(a2).length) {
    return false;
  }

  for (const i in a1) {
    const val = a1[i];
    const index = a2.findIndex((item, idx) => {
      // Ensure we only match at the same index if it's a hole vs value
      if (Object.hasOwn(a2, idx) && isEql(val, item)) {
        return true;
      }
      return false;
    });

    if (index < 0) {
      return false;
    }

    delete a2[index];
  }

  return true;
}
