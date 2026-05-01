/**
 * Calculates the population variance of the given array.
 *
 * @example
 *
 * variance([2, 4, 4, 4, 5, 5, 7, 9]) //=> 4
 */
export default function variance<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  if (arr.length === 0) return Number.NaN;
  const values = cb ? arr.map((v, i) => cb(v as T, i)) : (arr as number[]);
  const m = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((a, b) => a + (b - m) ** 2, 0) / values.length;
}
