// The final flush is spelled `decode(EMPTY)` rather than `decode()`, because
// some runtimes reject the no-argument call the spec allows. The two are
// equivalent: both flush whatever bytes were held back for a partial character.
const EMPTY = new Uint8Array(0);

/**
 * Reads a stream and yields it one line at a time, without buffering the whole
 * body first.
 *
 * This is the shape most line-oriented sources want — log tails, NDJSON, CSV,
 * server-sent events. Both `\n` and `\r\n` terminate a line, and neither is
 * included in the yielded value. A trailing terminator does not produce a final
 * empty line, but a blank line in the middle is preserved.
 *
 * @param {ReadableStream<Uint8Array | string>} stream The stream to read.
 * @returns {AsyncGenerator<string>} The lines, in order.
 *
 * @example
 * for await (const line of streamToLines(response.body)) {
 *   console.log(JSON.parse(line));
 * }
 */
export default async function* streamToLines(
  stream: ReadableStream<Uint8Array | string>,
): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer +=
        typeof value === 'string'
          ? value
          : decoder.decode(value, { stream: true });

      let index = buffer.indexOf('\n');

      while (index !== -1) {
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);

        yield line.endsWith('\r') ? line.slice(0, -1) : line;

        index = buffer.indexOf('\n');
      }
    }

    buffer += decoder.decode(EMPTY);

    // Whatever is left is a final line only if it is not empty, so a trailing
    // newline does not invent one.
    if (buffer !== '') {
      yield buffer.endsWith('\r') ? buffer.slice(0, -1) : buffer;
    }
  } finally {
    reader.releaseLock();
  }
}
