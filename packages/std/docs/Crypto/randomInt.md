# randomInt

Generates a cryptographically strong random integer within a range.

Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
in Node-compatible environments.

Both `min` and `max` must be integers.

### Example

```js
randomInt(1, 10) //=> 7
```
