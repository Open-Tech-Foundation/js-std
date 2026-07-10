# randomBytes

Generates cryptographically strong random values.

Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
in Node-compatible environments.

### Example

```js
randomBytes(16) //=> Uint8Array(16) [...]
```
