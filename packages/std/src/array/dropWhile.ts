/**
 * Creates a slice of array with elements dropped from the beginning or end while the predicate returns true.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function invoked per element.
 * @param {boolean} right If true, drops from the end.
 * @returns {T[]} A new array with dropped elements removed.
 *
 * @example
 * dropWhile([1, 2, 3, 4, 5], (n) => n < 3) //=> [3, 4, 5]
 * dropWhile([1, 2, 3, 4, 5], (n) => n > 3, true) //=> [1, 2, 3]
 */
export default function dropWhile<T>(
  arr: T[] = [],
  predicate: (val: T, index: number, arr: T[]) => boolean,
  right = false,
): T[] {
  if (!right) {
    for (let i = 0; i < arr.length; i++) {
      if (!predicate(arr[i], i, arr)) {
        return arr.slice(i);
      }
    }
    return [];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    if (!predicate(arr[i], i, arr)) {
      return arr.slice(0, i + 1);
    }
  }
  return [];
}
