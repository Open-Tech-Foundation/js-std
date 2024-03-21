import isArr from '../types/isArr';

type Falsy = null | undefined | boolean | number | string;

/**
 * Removes all the falsy values in the given array.
 *
 * @example
 *
 * compact([1, null, 2, 0, 3]) //=> [1, 2, 3]
 */
export default function compact<T>(arr: T[] = []): Partial<T[]> {
  if (!isArr(arr)) {
    return [];
  }

  const falsy: (T | Falsy)[] = [undefined, null, false, NaN, 0, ''];

  return arr.filter((val) => !falsy.includes(val));
}
