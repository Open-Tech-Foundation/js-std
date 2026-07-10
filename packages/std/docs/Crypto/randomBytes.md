# randomBytes

Generates cryptographically strong random values.

Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
in Node-compatible environments.

`size` must be a non-negative integer.

### Example

```js
randomBytes(16) //=> Uint8Array(16) [...]
```
