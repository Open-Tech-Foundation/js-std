/**
 * Reads a byte stream fully into a single `Uint8Array`.
 *
 * @param {ReadableStream<Uint8Array>} stream The stream to drain.
 * @returns {Promise<Uint8Array>} The concatenated bytes.
 *
 * @example
 * await streamToBytes(response.body) //=> Uint8Array [...]
 */
export default async function streamToBytes(
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      length += value.length;
    }
  } finally {
    reader.releaseLock();
  }

  // Concatenate once at the end rather than reallocating per chunk.
  const out = new Uint8Array(length);
  let offset = 0;

  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }

  return out;
}
