# encodeBase32

Encodes bytes to a Base32 string using the standard RFC 4648 alphabet.

This is the encoding used for TOTP/2FA shared secrets, which are normally exchanged unpadded — pass `{ pad: false }` for those.

@param bytes - The bytes to encode.
@param options - Set `pad` to `false` to omit the `=` padding.
@returns The Base32 string.

### Example

```js
encodeBase32(new Uint8Array([72, 101, 108, 108, 111])) //=> 'JBSWY3DP'

encodeBase32(stringToBytes('Hi'), { pad: false }) //=> 'JBUQ'
```
