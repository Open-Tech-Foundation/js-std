import isEql from '../common/isEql';

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
  const tmpArr1: unknown[] = [];
  const tmpArr2: unknown[] = [];

  arr1.forEach((i) => {
    tmpArr1.push(i);
  });
  arr2.forEach((i) => {
    tmpArr2.push(i);
  });

  if (tmpArr1.length !== tmpArr2.length) {
    return false;
  }

  for (const val of tmpArr1) {
    const index = tmpArr2.findIndex((item) => isEql(val, item));

    if (index < 0) {
      return false;
    }

    delete tmpArr2[index];
  }

  return true;
}
