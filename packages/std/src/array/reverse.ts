/**
 * Reverses the given list of elements order.
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
