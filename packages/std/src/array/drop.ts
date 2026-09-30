import isFunction from '../types/isFunction';
import isNull from '../types/isNull';

/** Options for {@link drop}. */
export interface DropOptions<T> {
  /** Tests whether an element should be counted as dropped. */
  predicate?: (value: T) => boolean;
  /** Drops elements from the end of the array. */
  fromEnd?: boolean;
}

/**
 * Skips the given number of elements at the start or end of the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} limit The number of elements to drop.
 * @param {DropOptions} [options] Predicate and direction options.
 * @returns {T[]} A new array with dropped elements.
 *
 * @example
 * drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
 * drop([1, 2, 3, 4, 5], 3, { fromEnd: true }) //=> [1, 2]
 */
export default function drop<T>(
  arr: T[],
  limit: number | null = 1,
  { predicate, fromEnd = false }: DropOptions<T> = {},
): T[] {
  if (!isNull(limit) && (!Number.isInteger(limit) || limit < 0)) {
    throw RangeError('The limit must be positive');
  }

  const curLimit = isNull(limit) ? arr.length : limit;
  const source = fromEnd ? [...arr].reverse() : arr;
  const a: T[] = [];
  let skipCount = 0;

  for (let i = 0; i < source.length; i++) {
    const val = source[i];
    if (skipCount < curLimit) {
      if (isFunction(predicate)) {
        if (predicate(val)) {
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

  return fromEnd ? a.reverse() : a;
}
