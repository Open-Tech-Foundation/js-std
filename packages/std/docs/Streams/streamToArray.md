# streamToArray

Reads a stream fully into an array of its chunks.

Works on a stream of any chunk type, so it is the general form of
`streamToText` and `streamToBytes`.

## Parameters

- **stream** `ReadableStream<T>` — The stream to drain.

## Returns

`Promise<T[]>` — The chunks, in order.

## Example

```js
await streamToArray(stream) //=> ['a', 'b', 'c']
```
