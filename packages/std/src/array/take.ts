import isFunction from '../types/isFunction';
import isNull from '../types/isNull';

/**
 * Creates a slice of array with n elements taken from the beginning or end.
 *
 * @param {T[]} arr The source array.
 * @param {number} limit The number of elements to take.
 * @param {Function} cb The callback to test elements.
 * @param {boolean} right If true, takes from the end.
 * @returns {T[]} A new array with taken elements.
 *
 * @example
 * take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
 * take([1, 2, 3, 4, 5], 3, undefined, true) //=> [3, 4, 5]
 */
export default function take<T>(
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

  for (let i = 0; i < source.length; i++) {
    const val = source[i];

    if (a.length === curLimit) {
      break;
    }

    if (isFunction(cb)) {
      if (cb(val)) {
        a.push(val);
      }
      continue;
    }

    a.push(val);
  }

  return right ? a.reverse() : a;
}
