/**
 * Creates a slice of array with elements taken from the beginning or end while the predicate returns true.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function invoked per element.
 * @param {boolean} right If true, takes from the end.
 * @returns {T[]} A new array with taken elements.
 *
 * @example
 * takeWhile([1, 2, 3, 4, 5], (n) => n < 4) //=> [1, 2, 3]
 * takeWhile([1, 2, 3, 4, 5], (n) => n > 3, true) //=> [4, 5]
 */
export default function takeWhile<T>(
  arr: T[] = [],
  predicate: (val: T, index: number, arr: T[]) => boolean,
  right = false,
): T[] {
  const source = right ? [...arr].reverse() : arr;
  const result: T[] = [];

  for (let i = 0; i < source.length; i++) {
    if (!predicate(source[i], i, source)) {
      break;
    }
    result.push(source[i]);
  }

  return right ? result.reverse() : result;
}
