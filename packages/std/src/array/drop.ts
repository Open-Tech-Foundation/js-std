import isFunction from '../types/isFunction';
import isNull from '../types/isNull';

/**
 * Skips the given number of elements at the start or end of the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} limit The number of elements to drop.
 * @param {Function} cb The callback to test elements.
 * @param {boolean} right If true, drops from the end.
 * @returns {T[]} A new array with dropped elements.
 *
 * @example
 * drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
 * drop([1, 2, 3, 4, 5], 3, undefined, true) //=> [1, 2]
 */
export default function drop<T>(
  arr: T[],
  limit: number | null = 1,
  cb?: (val: T) => boolean,
  right = false,
): T[] {
  if (!isNull(limit) && (!Number.isInteger(limit) || limit < 0)) {
    throw RangeError('The limit must be positive');
  }

  const curLimit = isNull(limit) ? arr.length : limit;
  const source = right ? [...arr].reverse() : arr;
  const a: T[] = [];
  let skipCount = 0;

  for (let i = 0; i < source.length; i++) {
    const val = source[i];
    if (skipCount < curLimit) {
      if (isFunction(cb)) {
        if (cb(val)) {
          skipCount += 1;
        } else {
          a.push(val);
        }
        continue;
      }

      skipCount += 1;
      continue;
    }

    a.push(val);
  }

  return right ? a.reverse() : a;
}
