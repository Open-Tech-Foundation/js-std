# decodeBase64

Decodes a Base64 string to bytes.

@param {string} str The Base64 string to decode.
@returns {Uint8Array} The decoded bytes.

### Example

```js
decodeBase64('SGVsbG8=') //=> Uint8Array [72, 101, 108, 108, 111]
```
