export interface SwapOptions {
  /** The index of the first element to swap. */
  x: number;
  /** The index of the second element to swap. */
  y: number;
}

/**
 * Swaps two elements in an array at the given indices.
 *
 * @param {T[]} arr The source array.
 * @param {SwapOptions} options The indexes of the elements to swap.
 * @returns {T[]} A new array with swapped elements.
 *
 * @example
 * swap([1, 2, 3, 4, 5], { x: 0, y: 1 }) //=> [2, 1, 3, 4, 5]
 */
export default function swap<T>(arr: T[], { x, y }: SwapOptions): T[] {
  if (arr.length === 0) {
    return [];
  }

  const a = arr.slice();
  const b = a[y];

  a[y] = a[x];
  a[x] = b;

  return a;
}
