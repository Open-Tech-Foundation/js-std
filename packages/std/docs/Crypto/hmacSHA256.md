# hmacSHA256

Computes an HMAC-SHA-256 digest of a message with the given key.

Uses Web Crypto when available and falls back to `node:crypto`
in Node-compatible environments.

@param key - The secret key.
@param message - The message to authenticate.
@returns The hex-encoded HMAC-SHA-256 digest.

### Example

```js
await hmacSHA256('secret', 'hello')
```
