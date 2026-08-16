# streamToBytes

Reads a byte stream fully into a single `Uint8Array`.

## Parameters

- **stream** `ReadableStream<Uint8Array>` — The stream to drain.

## Returns

`Promise<Uint8Array>` — The concatenated bytes.

## Example

```js
await streamToBytes(response.body) //=> Uint8Array [...]
```
