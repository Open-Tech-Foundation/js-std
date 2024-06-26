import isArr from '../types/isArr';

/**
 *  Splits the given array values into groups of a given size.
 *
 * @example
 *
 * chunk([1, 2, 3, 4, 5], 2) //=> [[1, 2], [3, 4], [5]]
 */
export default function chunk<T>(arr: T[] = [], size = 1): unknown[] {
  if (size < 1 || !isArr(arr)) {
    return [];
  }

  return arr.reduce((acc: Iterable<T>[], cur: T, i: number) => {
    return i % size === 0
      ? [...acc, [cur]]
      : [...acc.slice(0, -1), [...acc.slice(-1)[0], cur]];
  }, []);
}
