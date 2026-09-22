# isUtf8

Checks whether bytes contain a complete, valid UTF-8 sequence.

## Parameters

- **input** `Uint8Array | ArrayBuffer` — The bytes to validate.

## Returns

`boolean` — `true` when every byte belongs to a valid UTF-8 sequence.

## Throws

- `TypeError` — If the input is not a `Uint8Array` or `ArrayBuffer`.

## Example

```js
isUtf8(new Uint8Array([0x48, 0x69])) //=> true
isUtf8(new Uint8Array([0xc3, 0x28])) //=> false
```
