# hmacSHA256

Computes an HMAC-SHA-256 digest of a message with the given key.

Uses Node.js `crypto` module when available, otherwise falls back to
the Web Crypto API (`SubtleCrypto`).

@param key - The secret key.
@param message - The message to authenticate.
@returns The hex-encoded HMAC-SHA-256 digest.

### Example

```js

await hmacSHA256('secret', 'hello')
```
