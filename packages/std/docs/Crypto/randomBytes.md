# randomBytes

Generates cryptographically strong random values.

Uses the standard Web Crypto API (`globalThis.crypto`).

`size` must be a non-negative integer.

### Example

```js
randomBytes(16) //=> Uint8Array(16) [...]
```
