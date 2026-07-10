# decodeBase64Url

Decodes a URL-safe Base64 string to bytes.

Rejects standard Base64 `+` and `/` characters; use `decodeBase64()` for the
non-URL-safe alphabet.

@param {string} str The URL-safe Base64 string to decode.
@returns {Uint8Array} The decoded bytes.

### Example

```js
decodeBase64Url('aGVsbG8') //=> Uint8Array [104, 101, 108, 108, 111]
```
