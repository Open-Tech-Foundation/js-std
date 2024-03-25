import sort from '../array/sort';
import isEven from './isEven';

/**
 * Calculates the median value of the given array.
 *
 * @example
 *
 * median([1, 4, 2, 5, 0]) //=> 2
 *
 * median([10, 20, 40, 50]) //=> 30;
 */
export default function median(
  arr: number[] = [],
  cb?: (val: number, index: number) => number
) {
  let a = cb ? arr.map(cb) : arr;
  a = sort(arr);

  if (isEven(a.length)) {
    const i = a.length / 2;
    return (arr[i] + arr[i - 1]) / 2;
  }

  return arr[Math.floor(a.length / 2)];
}
