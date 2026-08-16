# flatMap

Maps each item and flattens the result into a single array.

## Parameters

- **arr** `T[]` — The source array.
- **fn** `Function` — The mapper function returning arrays.

## Returns

`U[]` — A new flattened array.

## Example

```js
flatMap([1, 2], (x) => [x, x * 10]) //=> [1, 10, 2, 20]
```
