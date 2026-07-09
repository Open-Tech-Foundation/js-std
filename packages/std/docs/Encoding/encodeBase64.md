# encodeBase64

Encodes bytes to a Base64 string.

@param {Uint8Array|ArrayBuffer} bytes The bytes to encode.
@returns {string} The Base64 encoded string.

### Example

```js
encodeBase64(new Uint8Array([72, 101, 108, 108, 111])) //=> 'SGVsbG8='
```
