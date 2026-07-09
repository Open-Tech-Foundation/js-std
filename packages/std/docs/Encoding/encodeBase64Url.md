# encodeBase64Url

Encodes bytes to a URL-safe Base64 string.

@param {Uint8Array|ArrayBuffer} bytes The bytes to encode.
@param {object} options The options object.
@param {boolean} options.pad Whether to add padding (default true).
@returns {string} The URL-safe Base64 encoded string.

### Example

```js
encodeBase64Url(new Uint8Array([104, 101, 108, 108, 111])) //=> 'aGVsbG8='
encodeBase64Url(new Uint8Array([104, 101, 108, 108, 111]), { pad: false }) //=> 'aGVsbG8'
```
