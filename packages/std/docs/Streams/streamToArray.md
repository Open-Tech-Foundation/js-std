# streamToArray

Reads a stream fully into an array of its chunks.

Works on a stream of any chunk type, so it is the general form of `streamToText` and `streamToBytes`.

@param stream - The stream to drain.
@returns The chunks, in order.

### Example

```js
await streamToArray(stream) //=> ['a', 'b', 'c']
```
