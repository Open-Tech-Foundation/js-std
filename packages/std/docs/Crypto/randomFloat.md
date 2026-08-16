# randomFloat

Generates a cryptographically strong random float within a range.

Uses the standard Web Crypto API (`globalThis.crypto`).

## Parameters

- **min** — The minimum value (inclusive).
- **max** — The maximum value (exclusive).

## Returns

A random float between min and max.

## Example

```js
randomFloat(0, 1) //=> 0.456789123456789
randomFloat(1, 5) //=> 3.141592653589793
```
