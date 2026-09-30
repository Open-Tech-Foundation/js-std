/** Options for {@link takeWhile}. */
export interface TakeWhileOptions {
  /** Takes from the end of the array. */
  fromEnd?: boolean;
}

/**
 * Creates a slice of array with elements taken from the beginning or end while the predicate returns true.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function invoked per element.
 * @param {TakeWhileOptions} [options] Direction options.
 * @returns {T[]} A new array with taken elements.
 *
 * @example
 * takeWhile([1, 2, 3, 4, 5], (n) => n < 4) //=> [1, 2, 3]
 * takeWhile([1, 2, 3, 4, 5], (n) => n > 3, { fromEnd: true }) //=> [4, 5]
 */
export default function takeWhile<T>(
  arr: T[] = [],
  predicate: (val: T, index: number, arr: T[]) => boolean,
  { fromEnd = false }: TakeWhileOptions = {},
): T[] {
  if (!fromEnd) {
    const result: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (!predicate(arr[i], i, arr)) {
        break;
      }
      result.push(arr[i]);
    }
    return result;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    if (!predicate(arr[i], i, arr)) {
      return arr.slice(i + 1);
    }
  }

  return arr.slice();
}
