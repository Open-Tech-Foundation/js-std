/**
 * Returns an AsyncGenerator that yields the items of each async iterable in turn.
 *
 * Each source is only started once the one before it is exhausted, so a
 * consumer that stops early never touches the later ones. Use `mergeStreams`
 * instead when the sources should run at the same time.
 *
 * @param {...AsyncIterable<T>} iterables The async iterables to concatenate.
 * @returns {AsyncGenerator<T>} A new async generator over all of them, in order.
 *
 * @example
 * const all = concatIterAsync(streamToIter(head), streamToIter(tail));
 * await toArrayIterAsync(all) //=> [...head, ...tail]
 */
export default async function* concatIterAsync<T>(
  ...iterables: AsyncIterable<T>[]
): AsyncGenerator<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}
