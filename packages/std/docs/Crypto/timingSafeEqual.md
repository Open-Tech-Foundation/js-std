# timingSafeEqual

Compares two values in constant time, so the comparison leaks no information about *where* they differ.

Use it instead of `===` whenever one side is a secret — an HMAC digest, an API key, a session token or a password hash. A plain `===` returns as soon as it hits the first differing byte, and that timing difference lets an attacker recover the expected value one byte at a time.

Strings are compared by their UTF-8 bytes. The comparison always scans the longer of the two inputs, so the running time reveals nothing beyond the input lengths, which are not secret for digests of a fixed size.

@param a - The first value.
@param b - The second value.
@returns `true` when both values hold the same bytes.

### Example

```js
const expected = await hmacSHA256(secret, payload);
timingSafeEqual(expected, receivedSignature) //=> true
```
