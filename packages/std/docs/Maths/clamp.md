# clamp

Returns a value clamped to the inclusive range of min and max.

## Parameters

- **val** `number` — The value to clamp.
- **options.min** `number` — The lower bound.
- **options.max** `number` — The upper bound.

## Returns

`number` — The clamped value.

## Example

```js
clamp(10, { min: -5, max: 5 }) //=> 5
clamp(0, { min: 1000, max: 1366 }) //=> 1000
```
