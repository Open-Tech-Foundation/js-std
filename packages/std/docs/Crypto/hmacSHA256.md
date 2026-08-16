# hmacSHA256

Computes an HMAC-SHA-256 digest of a message with the given key.

Uses the standard Web Crypto API (`crypto.subtle`).

## Parameters

- **key** — The secret key.
- **message** — The message to authenticate.

## Returns

The hex-encoded HMAC-SHA-256 digest.

## Example

```js
await hmacSHA256('secret', 'hello')
```
