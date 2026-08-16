# randomId

Generates a URL-friendly, cryptographically strong random ID.

The length is bounded by `MAX_RANDOM_LENGTH`, so a length taken from a
caller cannot turn into an unbounded loop.

## Parameters

- **length** `number` _(default: `21`)_ — The length of the ID.

## Returns

`string` — A random ID string.

## Throws

- `RangeError` — If `length` is not a non-negative safe integer or is above `MAX_RANDOM_LENGTH`.

## Example

```js
randomId() //=> 'V1StGXR8_Z5jdHi6B-myT'
```
