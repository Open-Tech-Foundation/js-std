import isArr from '../types/isArr';

type Falsy = null | undefined | boolean | number | string;
type WithFalsy<T> = T & Falsy;

/**
 * Removes all the falsy values in the given array.
 *
 * @example
 *
 * arrCompact([1, null, 2, 0, 3]) //=> [1, 2, 3]
 */
export default function arrCompact<T>(arr: WithFalsy<T>[] = []): Partial<T[]> {
  if (!isArr(arr)) {
    return [];
  }

  const falsy = [undefined, null, false, NaN, 0, ''];

  return arr.filter((val) => !falsy.includes(val));
}
