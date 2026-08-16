# takeWhile

Creates a slice of array with elements taken from the beginning or end while the predicate returns true.

## Parameters

- **arr** `T[]` — The source array.
- **predicate** `Function` — The function invoked per element.
- **right** `boolean` — If true, takes from the end.

## Returns

`T[]` — A new array with taken elements.

## Example

```js
takeWhile([1, 2, 3, 4, 5], (n) => n < 4) //=> [1, 2, 3]
takeWhile([1, 2, 3, 4, 5], (n) => n > 3, true) //=> [4, 5]
```
