/**
 * Splits an array into groups where consecutive elements satisfy the grouping predicate.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function that determines if two consecutive elements belong to the same chunk.
 * @returns {T[][]} A new array containing the chunks.
 *
 * @example
 * chunkWhile([1, 2, 4, 5, 7], (curr, next) => next - curr <= 2)
 * //=> [[1, 2, 4, 5], [7]]
 *
 * chunkWhile([1, 1, 2, 3, 5, 5, 6], (a, b) => a === b)
 * //=> [[1, 1], [2], [3], [5, 5], [6]]
 */
export default function chunkWhile<T>(
  arr: T[] = [],
  predicate: (curr: T, next: T, index: number, arr: T[]) => boolean,
): T[][] {
  if (arr.length === 0) {
    return [];
  }

  const result: T[][] = [[arr[0]]];

  for (let i = 1; i < arr.length; i++) {
    const curr = arr[i];
    const prev = arr[i - 1];

    if (predicate(prev, curr, i, arr)) {
      result[result.length - 1].push(curr);
    } else {
      result.push([curr]);
    }
  }

  return result;
}
