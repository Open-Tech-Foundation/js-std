# streamToText

Reads a stream fully into a string.

Byte chunks are decoded as UTF-8 across chunk boundaries, so a multi-byte character split between two chunks still decodes correctly. String chunks are concatenated as they are.

@param stream - The stream to drain.
@returns The decoded text.

### Example

```js
await streamToText(response.body) //=> 'Hello World'
```
