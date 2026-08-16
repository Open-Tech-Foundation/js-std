# hmacSHA512

Computes an HMAC-SHA-512 digest of a message with the given key.

Uses the standard Web Crypto API (`crypto.subtle`).

## Parameters

- **key** — The secret key.
- **message** — The message to authenticate.

## Returns

The hex-encoded HMAC-SHA-512 digest.

## Example

```js
await hmacSHA512('secret', 'hello')
```
