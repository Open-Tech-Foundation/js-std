// The final flush is spelled `decode(EMPTY)` rather than `decode()`, because
// some runtimes reject the no-argument call the spec allows. The two are
// equivalent: both flush whatever bytes were held back for a partial character.
const EMPTY = new Uint8Array(0);

/**
 * Reads a stream fully into a string.
 *
 * Byte chunks are decoded as UTF-8 across chunk boundaries, so a multi-byte
 * character split between two chunks still decodes correctly. String chunks are
 * concatenated as they are.
 *
 * @param {ReadableStream<Uint8Array | string>} stream The stream to drain.
 * @returns {Promise<string>} The decoded text.
 *
 * @example
 * await streamToText(response.body) //=> 'Hello World'
 */
export default async function streamToText(
  stream: ReadableStream<Uint8Array | string>,
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      out +=
        typeof value === 'string'
          ? value
          : decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  // Flush any bytes held back for a partial character.
  return out + decoder.decode(EMPTY);
}
