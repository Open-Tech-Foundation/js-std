/**
 * Reverses the order of elements in the given array.
 *
 * @param {T[]} arr The source array.
 * @returns {T[]} A new reversed array.
 *
 * @example
 * reverse([1, 2, 3]) //=> [3, 2, 1]
 */
export default function reverse<T>(arr: T[] = []): T[] {
  const a = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    a.push(arr[i]);
  }

  return a;
}
