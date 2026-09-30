# lerp

Linearly interpolates between two values using `start + (end - start) * progress`.

## Parameters

- **options.start** — The starting value.
- **options.end** — The ending value.
- **options.progress** — The interpolation parameter `t` in the formula. `0` returns `start`, `1` returns `end`, and values between them select a point between the endpoints. Values outside 0 to 1 extrapolate beyond them.

## Returns

The interpolated value.

## Example

```js
lerp({ start: 0, end: 10, progress: 0.5 }) //=> 5
lerp({ start: 100, end: 200, progress: 0.25 }) //=> 125
```
