# iterToStream

Turns an iterable, async iterable or iterator into a stream.

The inverse of `streamToIter`, and the step that hands an `*Iter` pipeline to
anything that consumes a `ReadableStream` — `Response`, `fetch`, `pipeThrough`.

The source is pulled lazily, one value per read, so an infinite generator is
safe and backpressure reaches it unchanged: nothing is produced until the
consumer asks. Cancelling the stream calls `return` on the source, which runs
the `finally` block of a generator.

## Parameters

- **iter** `AsyncIterable<T> | Iterable<T> | { next: () => Promise<IteratorResult<T>> | IteratorResult<T> }` — The source to read.

## Returns

`ReadableStream<T>` — A stream over every value, in order.

## Example

```js
const lines = mapIterAsync(streamToIter(stdin), (chunk) => decode(chunk));
new Response(iterToStream(lines));
```
