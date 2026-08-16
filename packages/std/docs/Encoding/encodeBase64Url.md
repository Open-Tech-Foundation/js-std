<!-- handwritten -->

# encodeBase64Url

Encodes bytes to a URL-safe Base64 string.

## Parameters

- **bytes** `Uint8Array|ArrayBuffer` — The bytes to encode.
- **options** `object` — The options object.
  - **options.pad** `boolean` — Whether to add padding (default true).

## Returns

`string` — The URL-safe Base64 encoded string.

## Example

```js
encodeBase64Url(new Uint8Array([104, 101, 108, 108, 111])) //=> 'aGVsbG8='
encodeBase64Url(new Uint8Array([104, 101, 108, 108, 111]), { pad: false }) //=> 'aGVsbG8'
```
