/**
 * Collects all items from an iterator into an array.
 *
 * @param {Iterable<T>} iter The iterable to collect.
 * @returns {T[]} An array of all items.
 *
 * @example
 * toArrayIter((function*() { yield 1; yield 2; })()) //=> [1, 2]
 */
export default function toArrayIter<T>(iter: Iterable<T>): T[] {
  const arr: T[] = [];
  for (const item of iter) {
    arr.push(item);
  }
  return arr;
}
