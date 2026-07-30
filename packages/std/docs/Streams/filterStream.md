# filterStream

Keeps only the chunks of a stream that satisfy a predicate.

The same result as reading the stream as an iterator, filtering it and turning
it back — `iterToStream(filterIterAsync(streamToIter(s), fn))` — with one call
instead of three, and without ever handing the caller something that is not a
`ReadableStream`.

Built on the `ReadableStream` constructor rather than `TransformStream`, which
the rest of this module also avoids: it is missing from some runtimes and
referring to it would throw when the module is imported, not when it is used.

Rejected chunks are read and discarded as the reader asks for more, so a run of
them costs reads but no memory. Cancelling the result cancels the source, and a
predicate that throws does the same before erroring the stream.

@param {ReadableStream<T>} stream The source stream.
@param {Function} fn The predicate to test each chunk with. May be async.
@returns {ReadableStream<T>} A stream of the chunks that passed.

### Example

```js
const errors = filterStream(lines, (line) => line.startsWith('ERROR'));
await streamToArray(errors) //=> ['ERROR one', 'ERROR two']
```
