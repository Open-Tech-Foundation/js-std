# streamToText

Reads a stream fully into a string.

Byte chunks are decoded as UTF-8 across chunk boundaries, so a multi-byte
character split between two chunks still decodes correctly. String chunks are
concatenated as they are.

## Parameters

- **stream** `ReadableStream<Uint8Array | string>` — The stream to drain.

## Returns

`Promise<string>` — The decoded text.

## Example

```js
await streamToText(response.body) //=> 'Hello World'
```
