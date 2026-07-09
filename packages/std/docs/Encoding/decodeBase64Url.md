# decodeBase64Url

Decodes a URL-safe Base64 string to bytes.

@param {string} str The URL-safe Base64 string to decode.
@returns {Uint8Array} The decoded bytes.

### Example

```js
decodeBase64Url('aGVsbG8') //=> Uint8Array [104, 101, 108, 108, 111]
```
