/**
 * Creates an array of elements split into two groups: those that pass the predicate and those that don't.
 *
 * @param {T[]} arr The source array.
 * @param {Function} predicate The function invoked per element.
 * @returns {[T[], T[]]} A tuple of [passing, failing] arrays.
 *
 * @example
 * partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)
 * //=> [[2, 4], [1, 3, 5]]
 *
 * partition([0, 1, false, 2, '', 3], Boolean)
 * //=> [[1, 2, 3], [0, false, '']]
 */
export default function partition<T>(
  arr: T[] = [],
  predicate: (val: T, index: number, arr: T[]) => boolean,
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (predicate(item, i, arr)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }

  return [pass, fail];
}
