/**
 * Returns the most frequent element in an array.
 *
 * @example
 *
 * mode([1, 2, 2, 3, 4]) //=> [2]
 *
 * mode(['a', 'b', 'b', 'c', 'c']) //=> ['b', 'c']
 */
export default function mode<T>(arr: T[] = [], cb?: (val: T) => unknown): T[] {
  if (arr.length === 0) {
    return [];
  }
  const a = cb ? (arr as T[]).map(cb) : arr;
  const map = new Map();
  for (const i of a) {
    map.set(i, (map.get(i) ?? 0) + 1);
  }

  const values = [...map.values()];
  const max = Math.max(...(values as number[]));

  if (max === 1) {
    return [];
  }

  const result: T[] = [];
  for (const [key, value] of map.entries()) {
    if (value === max) {
      result.push(key);
    }
  }

  return result;
}
