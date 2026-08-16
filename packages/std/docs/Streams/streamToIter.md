# streamToIter

Reads a stream as an async iterable, so the `*IterAsync` operators apply to it.

`ReadableStream` is async iterable on some runtimes and not on others, and
Safari still ships it without `Symbol.asyncIterator`. This gives every runtime
the same handle, which is what makes `mapIterAsync`, `filterIterAsync` and the
rest usable against a stream.

Leaving the loop early — `break`, `return`, or a throw — cancels the stream,
matching what the platform's own async iteration does. Pass `preventCancel` to
leave the stream open and readable by the next consumer instead; the reader
lock is released either way.

## Parameters

- **stream** `ReadableStream<T>` — The stream to read.
- **options** `{ preventCancel?: boolean }` _(optional)_ — Reader options.
  - **options.preventCancel** `boolean` _(default: `false`)_ — Leave the stream open when iteration ends early.

## Returns

`AsyncGenerator<T>` — The chunks, in order.

## Example

```js
const sizes = mapIterAsync(streamToIter(response.body), (chunk) => chunk.length);
await toArrayIterAsync(sizes) //=> [64, 64, 12]
```
