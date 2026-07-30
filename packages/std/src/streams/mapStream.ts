/**
 * Transforms each chunk of a stream, giving back a stream.
 *
 * The same result as reading the stream as an iterator, mapping it and turning
 * it back — `iterToStream(mapIterAsync(streamToIter(s), fn))` — with one call
 * instead of three, and without ever handing the caller something that is not
 * a `ReadableStream`. Reach for the round trip when the operator you want has
 * no stream form; the whole `*IterAsync` set is available through it.
 *
 * Built on the `ReadableStream` constructor rather than `TransformStream`,
 * which the rest of this module also avoids: it is missing from some runtimes
 * and referring to it would throw when the module is imported, not when it is
 * used.
 *
 * The source is read as the consumer asks, never drained ahead — save for the
 * single chunk the result stream keeps queued, which is the default for any
 * `ReadableStream` and what lets a slow source overlap with a slow consumer.
 * So backpressure reaches the source, and an endless one is safe.
 *
 * Cancelling the result cancels the source, and a callback that throws does
 * the same before erroring the stream, so the source is never left locked.
 *
 * @param {ReadableStream<T>} stream The source stream.
 * @param {Function} fn The callback to apply to each chunk. May be async.
 * @returns {ReadableStream<R>} A stream of the transformed chunks.
 *
 * @example
 * const sizes = mapStream(response.body, (chunk) => chunk.length);
 * await streamToArray(sizes) //=> [64, 64, 12]
 *
 * @example
 * const upper = mapStream(lines, async (line) => (await translate(line)).text);
 */
export default function mapStream<T, R>(
  stream: ReadableStream<T>,
  fn: (chunk: T, index: number) => R | Promise<R>,
): ReadableStream<R> {
  let reader: ReadableStreamDefaultReader<T> | null = null;
  let index = 0;

  const release = async (reason?: unknown) => {
    if (reader === null) {
      await stream.cancel(reason);
      return;
    }

    const inFlight = reader;
    reader = null;
    await inFlight.cancel(reason);
    inFlight.releaseLock();
  };

  return new ReadableStream<R>({
    async pull(controller) {
      reader ??= stream.getReader();

      const { done, value } = await reader.read();

      if (done) {
        controller.close();
        return;
      }

      try {
        controller.enqueue(await fn(value, index++));
      } catch (err) {
        // The stream is about to error, and nobody will read it again — so
        // the source has to be let go here or it stays locked forever.
        await release(err);
        throw err;
      }
    },

    cancel(reason) {
      return release(reason);
    },
  });
}
