# randomInt

Generates a cryptographically strong random integer within a range.

Uses the standard Web Crypto API (`globalThis.crypto`).

Both `min` and `max` must be integers.

### Example

```js
randomInt(1, 10) //=> 7
```
