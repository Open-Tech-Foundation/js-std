/**
 * Returns a Generator that yields one group per position, taking one item
 * from each iterable.
 *
 * Runs until every source is exhausted, padding the ones that finished early
 * with `undefined`, which is what `zip` does for arrays. That means an
 * infinite source never lets it end — pair it with `takeIter`.
 *
 * Each source is advanced exactly once per group and never read ahead, so the
 * items sit in memory one row at a time.
 *
 * @param {...Iterable<T>} iterables The iterables to zip.
 * @returns {Generator<(T|undefined)[]>} A new generator of groups.
 *
 * @example
 * const it = zipIter([1, 2], ['a', 'b']);
 * [...it] //=> [[1, 'a'], [2, 'b']]
 *
 * @example
 * [...zipIter([1, 2, 3], ['a'])] //=> [[1, 'a'], [2, undefined], [3, undefined]]
 */
export default function* zipIter<T>(
  ...iterables: Iterable<T>[]
): Generator<(T | undefined)[]> {
  if (iterables.length === 0) {
    return;
  }

  const iterators = iterables.map((it) => it[Symbol.iterator]());
  // Once a source is done it must not be advanced again, and it pads with
  // `undefined` for every remaining row.
  const done = new Array<boolean>(iterators.length).fill(false);

  try {
    while (true) {
      const row: (T | undefined)[] = new Array(iterators.length);
      let remaining = 0;

      for (let i = 0; i < iterators.length; i++) {
        if (done[i]) {
          row[i] = undefined;
          continue;
        }

        const res = iterators[i].next();
        if (res.done) {
          done[i] = true;
          row[i] = undefined;
        } else {
          row[i] = res.value;
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
    for (let i = 0; i < iterators.length; i++) {
      if (!done[i]) {
        iterators[i].return?.();
      }
    }
  }
}
