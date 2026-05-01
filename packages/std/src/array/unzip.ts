/**
 * Creates an array of ungrouped elements, the first of which contains the first elements of each group,
 * the second of which contains the second elements of each group, and so on.
 *
 * @param {T[][]} zipped The zipped array to unzip.
 * @returns {T[][]} A new array of arrays.
 *
 * @example
 * unzip([[1, 'a'], [2, 'b']]) //=> [[1, 2], ['a', 'b']]
 */
export default function unzip<T>(zipped: T[][] = []): T[][] {
  if (zipped.length === 0) {
    return [];
  }

  const maxLen = Math.max(...zipped.map((a) => a.length));
  const result: T[][] = [];

  for (let i = 0; i < maxLen; i++) {
    result.push(zipped.map((group) => group[i]));
  }

  return result;
}
