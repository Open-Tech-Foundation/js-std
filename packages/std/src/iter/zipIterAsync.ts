/**
 * Returns an AsyncGenerator that yields one group per position, taking one
 * item from each async iterable.
 *
 * The sources are advanced together rather than one after another, so a row
 * costs the slowest of them rather than the sum — which is the whole reason
 * to zip streams instead of collecting each one first.
 *
 * Runs until every source is exhausted, padding the ones that finished early
 * with `undefined`, which is what `zip` does for arrays. That means an
 * endless source never lets it end — pair it with `takeIterAsync`.
 *
 * @param {...AsyncIterable<T>} iterables The async iterables to zip.
 * @returns {AsyncGenerator<(T|undefined)[]>} A new async generator of groups.
 *
 * @example
 * const rows = zipIterAsync(streamToIter(names), streamToIter(scores));
 * await toArrayIterAsync(rows) //=> [['ann', 9], ['bob', 7]]
 */
export default async function* zipIterAsync<T>(
  ...iterables: AsyncIterable<T>[]
): AsyncGenerator<(T | undefined)[]> {
  if (iterables.length === 0) {
    return;
  }

  const iterators = iterables.map((it) => it[Symbol.asyncIterator]());
  // Once a source is done it must not be advanced again, and it pads with
  // `undefined` for every remaining row.
  const done = new Array<boolean>(iterators.length).fill(false);

  try {
    while (true) {
      const results = await Promise.all(
        iterators.map((iterator, i) =>
          done[i]
            ? Promise.resolve({ done: true as const, value: undefined })
            : iterator.next(),
        ),
      );

      const row: (T | undefined)[] = new Array(iterators.length);
      let remaining = 0;

      for (let i = 0; i < results.length; i++) {
        if (results[i].done) {
          done[i] = true;
          row[i] = undefined;
        } else {
          row[i] = results[i].value as T;
          remaining++;
        }
      }

      if (remaining === 0) {
        return;
      }

      yield row;
    }
  } finally {
    // Reached on a `break` or a throw as well as normal exhaustion, so a
    // source that is still open is told the consumer has gone.
    await Promise.all(
      iterators.map((iterator, i) =>
        done[i] ? undefined : iterator.return?.(),
      ),
    );
  }
}
