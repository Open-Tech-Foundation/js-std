# concatStreams

Joins streams end to end, reading each one only once the previous has closed.

Order is preserved, and the result pulls lazily — a later stream is not touched until the reader has drained everything before it. Cancelling the result cancels the stream in flight and every stream still queued.

Use `mergeStreams` when you want chunks as soon as any source produces them.

@param streams - The streams to concatenate.
@returns A stream over every chunk, in stream order.

### Example

```js
const all = concatStreams(header, body, footer);
await streamToText(all) //=> 'headerbodyfooter'
```
