# insert

Inserts items at the given index or before/after the first element matching the predicate.

## Parameters

- **arr** `T[]` — The source array.
- **indexOrFn** `number|Function` — The index or predicate function.
- **items** `T[]` — The items to insert.
- **position** `string` — Insert before or after the match (default 'before').

## Returns

`T[]` — A new array with the inserted items.

## Example

```js
insert([1, 2, 3], 1, 5); //=> [1, 5, 2, 3]
insert([1, 2, 3], (x) => x === 2, 5); //=> [1, 5, 2, 3]
insert([1, 2, 3], (x) => x === 2, 5, 'after'); //=> [1, 2, 5, 3]
```
