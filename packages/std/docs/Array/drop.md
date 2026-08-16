# drop

Skips the given number of elements at the start or end of the given array.

## Parameters

- **arr** `T[]` — The source array.
- **limit** `number` — The number of elements to drop.
- **cb** `Function` — The callback to test elements.
- **right** `boolean` — If true, drops from the end.

## Returns

`T[]` — A new array with dropped elements.

## Example

```js
drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
drop([1, 2, 3, 4, 5], 3, undefined, true) //=> [1, 2]
```
