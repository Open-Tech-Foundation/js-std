# randomInt

Generates a cryptographically strong random integer within a range.

Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
in Node-compatible environments.

### Example

```js
randomInt(1, 10) //=> 7
```
