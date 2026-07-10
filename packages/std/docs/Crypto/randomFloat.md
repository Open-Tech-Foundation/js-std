# randomFloat

Generates a cryptographically strong random float within a range.

Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
in Node-compatible environments.

@param min - The minimum value (inclusive).
@param max - The maximum value (exclusive).
@returns A random float between min and max.

### Example

```js
randomFloat(0, 1) //=> 0.456789123456789
randomFloat(1, 5) //=> 3.141592653589793
```
