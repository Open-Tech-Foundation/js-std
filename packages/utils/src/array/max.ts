import isEmpty from '../assert/isEmpty';
import compact from './compact';

/**
 * Returns the maximum value of the given array.
 *
 * @example
 * max([10, 20, 50, 30]) //=> 50
 */
export default function max<T>(
  arr: T[] = [],
  by: (val: T) => number = (x: T) => x as number
): T | null {
  const a = compact(arr);

  if (isEmpty(a)) {
    return null;
  }

  return (a as T[]).reduce((acc, cur) => {
    const a = by(acc);
    const b = by(cur);
    if (a === b) {
      return acc;
    }
    return a > b ? acc : cur;
  }) as T | null;
}
