# decodeBase58

Decodes a Base58 string using the Bitcoin alphabet.

Base58 is case-sensitive, and `0`, `O`, `I` and `l` are not part of the alphabet, so they are rejected rather than corrected.

@param str - The Base58 string to decode.
@returns The decoded bytes.
@throws If the string holds a non-Base58 character.

### Example

```js
decodeBase58('9Ajdvzr') //=> Uint8Array [72, 101, 108, 108, 111]

decodeBase58('112') //=> Uint8Array [0, 0, 1]
```
