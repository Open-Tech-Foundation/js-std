import fromIterAsync from '../iter/fromIterAsync';

/**
 * Turns an iterable, async iterable or iterator into a stream.
 *
 * The inverse of `streamToIter`, and the step that hands an `*Iter` pipeline to
 * anything that consumes a `ReadableStream` — `Response`, `fetch`, `pipeThrough`.
 *
 * The source is pulled lazily, one value per read, so an infinite generator is
 * safe and backpressure reaches it unchanged: nothing is produced until the
 * consumer asks. Cancelling the stream calls `return` on the source, which runs
 * the `finally` block of a generator.
 *
 * @param {AsyncIterable<T> | Iterable<T> | { next: () => Promise<IteratorResult<T>> | IteratorResult<T> }} iter The source to read.
 * @returns {ReadableStream<T>} A stream over every value, in order.
 *
 * @example
 * const lines = mapIterAsync(streamToIter(stdin), (chunk) => decode(chunk));
 * new Response(iterToStream(lines));
 */
export default function iterToStream<T>(
  iter:
    | AsyncIterable<T>
    | Iterable<T>
    | { next: () => Promise<IteratorResult<T>> | IteratorResult<T> },
): ReadableStream<T> {
  // Validates eagerly, so a bad source throws at the call rather than on the
  // first read, when there is no longer anything holding the stack.
  const iterator = fromIterAsync(iter);

  return new ReadableStream<T>({
    async pull(controller) {
      const { done, value } = await iterator.next();

      if (done) {
        controller.close();
        return;
      }

      controller.enqueue(value);
    },

    async cancel() {
      await iterator.return?.(undefined);
    },
  });
}
