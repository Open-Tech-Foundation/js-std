# hmacSHA512

Computes an HMAC-SHA-512 digest of a message with the given key.

Uses Web Crypto when available and falls back to `node:crypto`
in Node-compatible environments.

@param key - The secret key.
@param message - The message to authenticate.
@returns The hex-encoded HMAC-SHA-512 digest.

### Example

```js
await hmacSHA512('secret', 'hello')
```
