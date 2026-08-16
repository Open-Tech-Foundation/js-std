# randomInt

Generates a cryptographically strong random integer within an inclusive range.

Uses the standard Web Crypto API (`globalThis.crypto`).

The result is uniform. A random word is taken and reduced modulo the range,
which on its own would favour the low end — the words do not divide evenly
into the range, so the first `2**32 % range` results have one more word
mapping to them than the rest. Words in that remainder are drawn again
instead, leaving a count that the range divides exactly.

## Parameters

- **min** `number` — The lower bound, inclusive.
- **max** `number` — The upper bound, inclusive.

## Returns

`number` — A random integer between `min` and `max`.

## Throws

- `RangeError` — If either bound is not an integer, or the range is wider than `Number.MAX_SAFE_INTEGER`.

## Example

```js
randomInt(1, 10) //=> 7
```
