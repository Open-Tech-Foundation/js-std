# encodeHex

Encodes bytes to a hexadecimal string.

@param {Uint8Array|ArrayBuffer} bytes The bytes to encode.
@returns {string} The hexadecimal encoded string.

### Example

```js
encodeHex(new Uint8Array([72, 101, 108, 108, 111])) //=> '48656c6c6f'
```
