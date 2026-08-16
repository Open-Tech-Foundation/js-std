# streamToLines

Reads a stream and yields it one line at a time, without buffering the whole
body first.

This is the shape most line-oriented sources want — log tails, NDJSON, CSV,
server-sent events. Both `\n` and `\r\n` terminate a line, and neither is
included in the yielded value. A trailing terminator does not produce a final
empty line, but a blank line in the middle is preserved.

## Parameters

- **stream** `ReadableStream<Uint8Array | string>` — The stream to read.

## Returns

`AsyncGenerator<string>` — The lines, in order.

## Example

```js
for await (const line of streamToLines(response.body)) {
  console.log(JSON.parse(line));
}
```
