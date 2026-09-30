# drop

Skips the given number of elements at the start or end of the given array.

## Parameters

- **arr** `T[]` — The source array.
- **limit** `number` — The number of elements to drop.
- **options.predicate** `Function` _(optional)_ — Tests whether an element should be counted as dropped.
- **options.fromEnd** `boolean` _(optional)_ — If true, drops from the end.

## Returns

`T[]` — A new array with dropped elements.

## Example

```js
drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
drop([1, 2, 3, 4, 5], 3, { fromEnd: true }) //=> [1, 2]
```
