# replace

Replaces items at the given index or all elements matching the predicate.

## Parameters

- **arr** `T[]` — The source array.
- **indexOrFn** `number|Function` — The index or predicate function.
- **items** `T[]` — The items to replace with.

## Returns

`T[]` — A new array with the replaced items.

## Example

```js
replace([1, 2, 3], 1, 5); //=> [1, 5, 3]
replace([1, 2, 3, 4, 5], (x) => x % 2 === 0, 0); //=> [1, 0, 3, 0, 5]
```
