# take

Creates a slice of array with n elements taken from the beginning or end.

## Parameters

- **arr** `T[]` — The source array.
- **limit** `number` — The number of elements to take.
- **cb** `Function` — The callback to test elements.
- **right** `boolean` — If true, takes from the end.

## Returns

`T[]` — A new array with taken elements.

## Example

```js
take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
take([1, 2, 3, 4, 5], 3, undefined, true) //=> [3, 4, 5]
```
