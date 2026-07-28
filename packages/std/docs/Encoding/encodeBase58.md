# encodeBase58

Encodes bytes to a Base58 string using the Bitcoin alphabet.

Base58 drops the characters that are easy to confuse when read or typed by a human (`0`, `O`, `I` and `l`) and uses no punctuation, so the result survives double-click selection and URLs unescaped. It is the encoding behind Bitcoin and Solana addresses, IPFS CIDv0 hashes and short public identifiers.

Unlike Base64, Base58 is a whole-number base conversion rather than a bit regrouping, so it has no fixed block size and no padding. Leading zero bytes carry no numeric weight, so they are preserved separately as leading `1`s.

@param bytes - The bytes to encode.
@returns The Base58 string.

### Example

```js
encodeBase58(new Uint8Array([72, 101, 108, 108, 111])) //=> '9Ajdvzr'

encodeBase58(new Uint8Array([0, 0, 1])) //=> '112'
```
