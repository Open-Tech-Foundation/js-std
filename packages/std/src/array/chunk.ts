/**
 * Splits an array into groups of a specified size.
 *
 * @param {T[]} arr The source array.
 * @param {number} size The length of each chunk.
 * @returns {T[][]} A new array containing the chunks.
 *
 * @example
 * chunk(['a', 'b', 'c', 'd'], 2) //=> [['a', 'b'], ['c', 'd']]
 * chunk(['a', 'b', 'c', 'd'], 3) //=> [['a', 'b', 'c'], ['d']]
 */
export default function chunk<T>(arr: T[] = [], size = 1): T[][] {
  if (size <= 0) {
    return [];
  }
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
