# decodeBase32

Decodes a Base32 string using the standard RFC 4648 alphabet.

Padding is optional, whitespace is ignored and lowercase input is accepted, so TOTP/2FA secrets can be passed in the form users normally see them.

@param str - The Base32 string to decode.
@returns The decoded bytes.
@throws If the string is truncated or holds a non-Base32 character.

### Example

```js
decodeBase32('JBSWY3DP') //=> Uint8Array [72, 101, 108, 108, 111]

bytesToString(decodeBase32('jbsw y3dp')) //=> 'Hello'
```
