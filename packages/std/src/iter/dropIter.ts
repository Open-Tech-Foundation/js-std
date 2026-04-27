/**
 * Returns a Generator that skips the first n items from an Iterable.
 *
 * @param {Iterable} iterable The source iterable.
 * @param {number} n The number of items to skip.
 * @returns {Generator} A new generator with the remaining items.
 *
 * @example
 * const it = dropIter([1, 2, 3], 1);
 * [...it] //=> [2, 3]
 */
export default function* dropIter<T>(
  iterable: Iterable<T>,
  n: number,
): Generator<T> {
  let count = 0;
  for (const item of iterable) {
    if (count < n) {
      count++;
      continue;
    }
    yield item;
  }
}
