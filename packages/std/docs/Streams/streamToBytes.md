# streamToBytes

Reads a byte stream fully into a single `Uint8Array`.

@param stream - The stream to drain.
@returns The concatenated bytes.

### Example

```js
await streamToBytes(response.body) //=> Uint8Array [...]
```
