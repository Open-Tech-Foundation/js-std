# decodeBase58

Decodes a Base58 string using the Bitcoin alphabet.

Base58 is case-sensitive, and `0`, `O`, `I` and `l` are not part of the
alphabet, so they are rejected rather than corrected.

## Parameters

- **str** `string` — The Base58 string to decode.

## Returns

`Uint8Array` — The decoded bytes.

## Throws

- `Error` — If the string holds a non-Base58 character.

## Examples

```js
decodeBase58('9Ajdvzr') //=> Uint8Array [72, 101, 108, 108, 111]
```

```js
decodeBase58('112') //=> Uint8Array [0, 0, 1]
```
