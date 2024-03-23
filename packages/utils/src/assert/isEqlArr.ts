import size from '../object/size';
import isEql from './isEql';

/**
 * Checks deeply if the given two arrays with different orders are equivalent.
 *
 * @example
 *
 * isEqlArr([1, 3, 2], [2, 1, 3]) //=> true
 *
 * isEqlArr([1, 3, 2], [2, 1, 5]) //=> false
 */
export default function isEqlArr(arr1: unknown[], arr2: unknown[]): boolean {
  const a1: unknown[] = arr1.flat();
  const a2: unknown[] = arr2.flat();

  if (size(a1) !== size(a2)) {
    return false;
  }

  for (const val of a1) {
    const index = a2.findIndex((item) => isEql(val, item));

    if (index < 0) {
      return false;
    }

    delete a2[index];
  }

  return true;
}
