import isFunction from '../types/isFunction';
import isNull from '../types/isNull';

/** Options for {@link take}. */
export interface TakeOptions<T> {
  /** Tests whether an element should be taken. */
  predicate?: (value: T) => boolean;
  /** Takes elements from the end of the array. */
  fromEnd?: boolean;
}

/**
 * Creates a slice of array with n elements taken from the beginning or end.
 *
 * @param {T[]} arr The source array.
 * @param {number} limit The number of elements to take.
 * @param {TakeOptions} [options] Predicate and direction options.
 * @returns {T[]} A new array with taken elements.
 *
 * @example
 * take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
 * take([1, 2, 3, 4, 5], 3, { fromEnd: true }) //=> [3, 4, 5]
 */
export default function take<T>(
  arr: T[],
  limit: number | null = 1,
  { predicate, fromEnd = false }: TakeOptions<T> = {},
): T[] {
  if (!isNull(limit) && (!Number.isInteger(limit) || limit < 0)) {
    throw RangeError('The limit must be positive');
  }

  const curLimit = isNull(limit) ? arr.length : limit;
  const source = fromEnd ? [...arr].reverse() : arr;
  const a: T[] = [];

  for (let i = 0; i < source.length; i++) {
    const val = source[i];

    if (a.length === curLimit) {
      break;
    }

    if (isFunction(predicate)) {
      if (predicate(val)) {
        a.push(val);
      }
      continue;
    }

    a.push(val);
  }

  return fromEnd ? a.reverse() : a;
}
