import validateChunkSize from '../array/validateChunkSize';

function* chunks<T>(iterable: Iterable<T>, size: number): Generator<T[]> {
  let batch: T[] = [];

  for (const item of iterable) {
    batch.push(item);
    if (batch.length === size) {
      yield batch;
      batch = [];
    }
  }

  if (batch.length > 0) {
    yield batch;
  }
}

/**
 * Returns a Generator that yields the items in groups of a specified size.
 *
 * Only one group is held at a time, so this works on a source too large to
 * collect — the reason to reach for it over `chunk`, which needs the whole
 * array up front. A trailing group shorter than `size` is still yielded.
 *
 * @param {Iterable<T>} iterable The source iterable.
 * @param {number} [size=1] The length of each group.
 * @returns {Generator<T[]>} A new generator of groups.
 * @throws {Error} If `size` is not an integer greater than zero.
 *
 * @example
 * const it = chunkIter([1, 2, 3, 4, 5], 2);
 * [...it] //=> [[1, 2], [3, 4], [5]]
 */
export default function chunkIter<T>(
  iterable: Iterable<T>,
  size = 1,
): Generator<T[]> {
  // Eagerly, rather than on the first pull: a generator body does not run
  // until then, and a bad argument should throw while the call that made it
  // is still on the stack.
  validateChunkSize(size);

  return chunks(iterable, size);
}
