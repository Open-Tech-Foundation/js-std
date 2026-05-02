/**
 * Returns the first element of the array.
 *
 * @param {T[]} arr The source array.
 * @returns {T | undefined} The first element, or undefined if empty.
 *
 * @example
 * first([1, 2, 3]) //=> 1
 * first([]) //=> undefined
 */

export default function first<T>(arr: T[] = []): T | undefined {
  return arr[0];
}
