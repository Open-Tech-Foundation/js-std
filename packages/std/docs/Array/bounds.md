# bounds

Returns the minimum and maximum values of the given array.

## Parameters

- **arr** `T[]` — The source array.
- **by** `Function` — The iteratee to pick the value.

## Returns

`[T, T] | null` — An array containing the minimum and maximum values.

## Example

```js
bounds([10, 20, 50, 30]) //=> [10, 50]
```
