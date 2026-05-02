/**
 * Returns the last element of the array.
 *
 * @param {T[]} arr The source array.
 * @returns {T | undefined} The last element, or undefined if empty.
 *
 * @example
 * last([1, 2, 3]) //=> 3
 * last([]) //=> undefined
 */

export default function last<T>(arr: T[] = []): T | undefined {
  return arr[arr.length - 1];
}
