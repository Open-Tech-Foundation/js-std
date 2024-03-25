import isFn from '../types/isFn';
import isNull from '../types/isNull';

/**
 * Slices the given array from the start to the given limit.
 *
 * @example
 * take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
 */
export default function take<T>(
  arr: T[],
  limit: number | null = 1,
  cb?: (val: T) => boolean
) {
  if (!isNull(limit) && (!Number.isInteger(limit) || limit < 0)) {
    throw RangeError('The limit must be positive');
  }

  const curLimit = isNull(limit) ? arr.length : limit;

  const a = [];

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];

    if (a.length === curLimit) {
      break;
    }

    if (isFn(cb)) {
      if (cb(val)) {
        a.push(val);
      }
      continue;
    }

    a.push(val);
  }

  return a;
}
