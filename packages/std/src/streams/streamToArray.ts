/**
 * Reads a stream fully into an array of its chunks.
 *
 * Works on a stream of any chunk type, so it is the general form of
 * `streamToText` and `streamToBytes`.
 *
 * @param {ReadableStream<T>} stream The stream to drain.
 * @returns {Promise<T[]>} The chunks, in order.
 *
 * @example
 * await streamToArray(stream) //=> ['a', 'b', 'c']
 */
export default async function streamToArray<T>(
  stream: ReadableStream<T>,
): Promise<T[]> {
  const reader = stream.getReader();
  const chunks: T[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return chunks;
}
