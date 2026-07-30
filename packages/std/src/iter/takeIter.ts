/**
 * Returns a Generator that yields the first n items from an Iterable.
 *
 * Exactly `n` items are read from the source and no more, so a value the
 * result does not include is never produced — which matters when producing
 * one is expensive or has a side effect.
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
  if (n <= 0) {
    return;
  }

  let count = 0;
  for (const item of iterable) {
    yield item;
    if (++count >= n) {
      return;
    }
  }
}
