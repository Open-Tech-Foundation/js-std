/**
 * Joins streams end to end, reading each one only once the previous has closed.
 *
 * Order is preserved, and the result pulls lazily — a later stream is not
 * touched until the reader has drained everything before it. Cancelling the
 * result cancels the stream in flight and every stream still queued.
 *
 * Use `mergeStreams` when you want chunks as soon as any source produces them.
 *
 * @param {...ReadableStream<T>} streams The streams to concatenate.
 * @returns {ReadableStream<T>} A stream over every chunk, in stream order.
 *
 * @example
 * const all = concatStreams(header, body, footer);
 * await streamToText(all) //=> 'headerbodyfooter'
 */
export default function concatStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  let index = 0;
  let reader: ReadableStreamDefaultReader<T> | null = null;

  return new ReadableStream<T>({
    async pull(controller) {
      while (true) {
        if (reader === null) {
          if (index >= streams.length) {
            controller.close();
            return;
          }

          reader = streams[index++].getReader();
        }

        const { done, value } = await reader.read();

        if (done) {
          reader.releaseLock();
          reader = null;
          continue;
        }

        controller.enqueue(value);
        return;
      }
    },

    async cancel(reason) {
      if (reader !== null) {
        const inFlight = reader;
        reader = null;
        await inFlight.cancel(reason);
        inFlight.releaseLock();
      }

      // Everything not yet started still needs releasing.
      await Promise.all(streams.slice(index).map((s) => s.cancel(reason)));
    },
  });
}
