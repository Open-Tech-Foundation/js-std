/**
 * Interleaves streams, forwarding every chunk as soon as any source produces
 * it. The result closes once every source has closed, and errors as soon as any
 * source errors.
 *
 * Because the sources are read concurrently, chunk order between them is not
 * defined — only the order within a single source is. Use `concatStreams` when
 * order across sources matters.
 *
 * @param {...ReadableStream<T>} streams The streams to merge.
 * @returns {ReadableStream<T>} A stream over every chunk, as it arrives.
 *
 * @example
 * const events = mergeStreams(clicks, keys);
 * for await (const event of streamToArray(events)) { }
 */
export default function mergeStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  const readers: ReadableStreamDefaultReader<T>[] = [];

  return new ReadableStream<T>({
    start(controller) {
      if (streams.length === 0) {
        controller.close();
        return;
      }

      const pump = async (stream: ReadableStream<T>) => {
        const reader = stream.getReader();
        readers.push(reader);

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              return;
            }

            controller.enqueue(value);
          }
        } finally {
          reader.releaseLock();
        }
      };

      // Not awaited: the sources are drained in the background so a slow one
      // never holds up the others.
      Promise.all(streams.map(pump)).then(
        () => controller.close(),
        (error) => controller.error(error),
      );
    },

    async cancel(reason) {
      // The pumps hold the locks, so the sources have to be cancelled through
      // their readers rather than directly.
      await Promise.all(readers.map((reader) => reader.cancel(reason)));
    },
  });
}
