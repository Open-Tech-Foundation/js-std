/**
 * Creates a slice of array with elements taken from the beginning while the predicate returns true.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function invoked per element.
 * @returns {T[]} A new array with taken elements.
 *
 * @example
 * takeWhile([1, 2, 3, 4, 5], (n) => n < 4) //=> [1, 2, 3]
 * takeWhile([1, 2, 3], (n) => n > 3) //=> []
 */
export default function takeWhile<T>(
  arr: T[] = [],
  predicate: (val: T, index: number, arr: T[]) => boolean,
): T[] {
  const result: T[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) {
      break;
    }
    result.push(arr[i]);
  }

  return result;
}
