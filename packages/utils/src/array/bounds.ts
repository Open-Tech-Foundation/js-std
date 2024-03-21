import { max, min } from '..';
import isEmpty from '../assert/isEmpty';
import compact from './compact';

/**
 * Returns a tuple of the min & max values of the given array.
 *
 * @example
 * bounds([10, 20, 50, 30]) //=> [10, 50]
 */
export default function bounds<T>(
  arr: T[] = [],
  by: (val: T) => number = (x: T) => x as number
): [T, T] | null {
  const a = compact(arr);

  if (isEmpty(a)) {
    return null;
  }

  return [min(arr, by), max(arr, by)] as [T, T];
}
