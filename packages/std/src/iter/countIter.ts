/**
 * Returns the total count of items in an iterable.
 *
 * @param {Iterable<unknown>} iter The iterable to count.
 * @returns {number} The total count of items.
 *
 * @example
 * countIter((function*() { yield 1; yield 2; })()) //=> 2
 */
export default function countIter(iter: Iterable<unknown>): number {
  let count = 0;
  for (const _ of iter) {
    count++;
  }
  return count;
}
