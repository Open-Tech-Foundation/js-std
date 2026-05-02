# base64UrlDecode

Decodes a Base64 URL-safe string.

@param {string} str The Base64 URL-encoded string to decode.
@returns {string} The decoded string.

### Example

```js
base64UrlDecode('aGVsbG8_d29ybGQ=') //=> 'hello?world'
base64UrlDecode('aGVsbG8_d29ybGQ') //=> 'hello?world'
```
