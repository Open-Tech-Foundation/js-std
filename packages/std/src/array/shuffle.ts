import randomInt from '../crypto/randomInt';

/**
 * Randomizes the order of the elements in a given array.
 *
 * Uses a Fisher-Yates shuffle drawing from the same crypto-backed source as
 * `sample`, rather than `Math.random`. `Math.random` is a seeded generator
 * whose output can be predicted from earlier draws, which is the wrong tool
 * the moment an order carries any weight — assigning treatments, picking a
 * winner, ordering anything an adversary would rather guess.
 *
 * @param {T[]} arr The source array.
 * @returns {T[]} A new shuffled array.
 *
 * @example
 * shuffle([1, 2, 3]) //=> [2, 3, 1]
 */
export default function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }

  return a;
}
