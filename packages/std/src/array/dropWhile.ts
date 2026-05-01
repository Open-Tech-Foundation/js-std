/**
 * Creates a slice of array with elements dropped from the beginning while the predicate returns true.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function invoked per element.
 * @returns {T[]} A new array with dropped elements removed.
 *
 * @example
 * dropWhile([1, 2, 3, 4, 5], (n) => n < 3) //=> [3, 4, 5]
 * dropWhile([1, 2, 3], (n) => n > 3) //=> [1, 2, 3]
 */
export default function dropWhile<T>(
  arr: T[] = [],
  predicate: (val: T, index: number, arr: T[]) => boolean,
): T[] {
  let dropped = false;

  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) {
      dropped = true;
      return arr.slice(i);
    }
  }

  return dropped ? [] : [];
}
