# take

Creates a slice of array with n elements taken from the beginning or end.

## Parameters

- **arr** `T[]` — The source array.
- **limit** `number` — The number of elements to take.
- **options.predicate** `Function` _(optional)_ — Tests whether an element should be taken.
- **options.fromEnd** `boolean` _(optional)_ — If true, takes from the end.

## Returns

`T[]` — A new array with taken elements.

## Example

```js
take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
take([1, 2, 3, 4, 5], 3, { fromEnd: true }) //=> [3, 4, 5]
```
