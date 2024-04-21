/**
 * Shuffles the given array values.
 *
 * shuffle([1, 2, 3]) //=> [3, 1, 2]
 */

export default function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  let i = a.length,
    randIdx,
    t;

  while (i) {
    randIdx = Math.floor(Math.random() * i--);
    t = a[i];
    a[i] = a[randIdx];
    a[randIdx] = t;
  }

  return a;
}
