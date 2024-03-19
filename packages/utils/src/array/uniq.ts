import isEql from '../assert/isEql';
import isFn from '../types/isFn';

/**
 * Creates a unique array by removing all duplicate values from the given array.
 *
 * @example
 *
 * uniq([1, 2, 2, 3]) //=> [1, 2, 3]
 */

export default function uniq<T>(
  arr: T[] = [],
  by?: (val: T) => unknown
): Partial<T[]> {
  return arr.reduce((acc: unknown[], cur) => {
    let flag = false;

    for (const item of acc) {
      const v1 = isFn(by) ? by(item as T) : item;
      const v2 = isFn(by) ? by(cur) : cur;
      if (isEql(v1, v2)) {
        flag = true;
        break;
      }
    }

    if (!flag) {
      acc.push(cur);
    }

    return acc;
  }, []) as Partial<T[]>;
}
