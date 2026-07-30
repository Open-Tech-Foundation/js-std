export interface StreamToIterOptions {
  /** Leave the stream open when iteration ends early. Defaults to `false`. */
  preventCancel?: boolean;
}

/**
 * Reads a stream as an async iterable, so the `*IterAsync` operators apply to it.
 *
 * `ReadableStream` is async iterable on some runtimes and not on others, and
 * Safari still ships it without `Symbol.asyncIterator`. This gives every runtime
 * the same handle, which is what makes `mapIterAsync`, `filterIterAsync` and the
 * rest usable against a stream.
 *
 * Leaving the loop early — `break`, `return`, or a throw — cancels the stream,
 * matching what the platform's own async iteration does. Pass `preventCancel` to
 * leave the stream open and readable by the next consumer instead; the reader
 * lock is released either way.
 *
 * @param {ReadableStream<T>} stream The stream to read.
 * @param {{ preventCancel?: boolean }} [options] Reader options.
 * @param {boolean} [options.preventCancel=false] Leave the stream open when iteration ends early.
 * @returns {AsyncGenerator<T>} The chunks, in order.
 *
 * @example
 * const sizes = mapIterAsync(streamToIter(response.body), (chunk) => chunk.length);
 * await toArrayIterAsync(sizes) //=> [64, 64, 12]
 */
export default async function* streamToIter<T>(
  stream: ReadableStream<T>,
  options: StreamToIterOptions = {},
): AsyncGenerator<T> {
  const { preventCancel = false } = options;
  const reader = stream.getReader();
  let settled = false;

  try {
    while (true) {
      let result: ReadableStreamReadResult<T>;

      try {
        result = await reader.read();
      } catch (error) {
        // The stream is already errored, so there is nothing left to cancel.
        // Cancelling anyway would reject with this same error from inside the
        // `finally`, replacing the failure the caller is about to see.
        settled = true;
        throw error;
      }

      if (result.done) {
        settled = true;
        break;
      }

      yield result.value;
    }
  } finally {
    // Only an unfinished stream has anything left to release — a drained or
    // errored one is already closed, and cancelling it would be a no-op.
    if (!settled && !preventCancel) {
      await reader.cancel();
    }

    reader.releaseLock();
  }
}
