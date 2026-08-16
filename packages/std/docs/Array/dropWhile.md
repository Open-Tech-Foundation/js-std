# dropWhile

Creates a slice of array with elements dropped from the beginning or end while the predicate returns true.

## Parameters

- **arr** `T[]` — The source array.
- **predicate** `Function` — The function invoked per element.
- **right** `boolean` — If true, drops from the end.

## Returns

`T[]` — A new array with dropped elements removed.

## Example

```js
dropWhile([1, 2, 3, 4, 5], (n) => n < 3) //=> [3, 4, 5]
dropWhile([1, 2, 3, 4, 5], (n) => n > 3, true) //=> [1, 2, 3]
```
