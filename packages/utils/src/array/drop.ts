import isFn from '../types/isFn';
import isNull from '../types/isNull';

/**
 * Skips the given number of elements at the start of the given array.
 *
 * @example
 * drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
 */
export default function drop<T>(
  arr: T[],
  limit: number | null = 1,
  cb?: (val: T) => boolean
) {
  if (!isNull(limit) && (!Number.isInteger(limit) || limit < 0)) {
    throw RangeError('The limit must be positive');
  }

  const curLimit = isNull(limit) ? arr.length : limit;

  const a = [];
  let skipCount = 0;

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    if (skipCount < curLimit) {
      if (isFn(cb)) {
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

  return a;
}
