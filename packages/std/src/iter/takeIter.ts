/**
 * Returns a Generator that yields the first n items from an Iterable.
 *
 * @param {Iterable} iterable The source iterable.
 * @param {number} n The number of items to take.
 * @returns {Generator} A new generator with the first n items.
 *
 * @example
 * const it = takeIter([1, 2, 3], 2);
 * [...it] //=> [1, 2]
 */
export default function* takeIter<T>(
  iterable: Iterable<T>,
  n: number,
): Generator<T> {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) break;
    yield item;
    count++;
  }
}
