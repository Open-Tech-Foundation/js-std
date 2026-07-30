import validateChunkSize from '../array/validateChunkSize';

async function* chunks<T>(
  iterable: AsyncIterable<T>,
  size: number,
): AsyncGenerator<T[]> {
  let batch: T[] = [];

  for await (const item of iterable) {
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
 * Returns an AsyncGenerator that yields the items in groups of a specified size.
 *
 * Only one group is held at a time, so this works on a stream too large to
 * collect — batching rows for an insert, or bytes for a write. A trailing
 * group shorter than `size` is still yielded.
 *
 * @param {AsyncIterable<T>} iterable The source async iterable.
 * @param {number} [size=1] The length of each group.
 * @returns {AsyncGenerator<T[]>} A new async generator of groups.
 * @throws {Error} If `size` is not an integer greater than zero.
 *
 * @example
 * for await (const batch of chunkIterAsync(rows, 500)) {
 *   await db.insertMany(batch);
 * }
 */
export default function chunkIterAsync<T>(
  iterable: AsyncIterable<T>,
  size = 1,
): AsyncGenerator<T[]> {
  // Eagerly, rather than on the first pull: a generator body does not run
  // until then, and a bad argument should throw while the call that made it
  // is still on the stack.
  validateChunkSize(size);

  return chunks(iterable, size);
}
