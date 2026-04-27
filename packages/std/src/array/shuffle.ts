/**
 * Randomizes the order of the elements in a given array.
 *
 * @param {T[]} arr The source array.
 * @returns {T[]} A new shuffled array.
 *
 * @example
 * shuffle([1, 2, 3]) //=> [2, 3, 1]
 */

export default function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  let i = a.length;
  let randIdx: number;
  let t: T;

  while (i) {
    randIdx = Math.floor(Math.random() * i--);
    t = a[i] as T;
    a[i] = a[randIdx] as T;
    a[randIdx] = t;
  }

  return a;
}
