/**
 * Calculates the mode value of the given array.
 *
 * @example
 *
 * mode([0, 0, 1, 1, 1, 2, 3]) //=> [1]
 */

export default function mode<T>(
  arr: T[] = [],
  cb?: (v: T, index: number) => number
): number[] {
  const a = cb ? arr.map(cb) : arr;
  const map = new Map();
  a.forEach((i) => {
    map.set(i, (map.get(i) ?? 0) + 1);
  });

  const values = [...map.values()];

  const max = Math.max(...values);

  const out = [];

  for (const [key, val] of map) {
    if (val === max) {
      out.push(key);
    }
  }

  return out.length === arr.length ? [] : out;
}
