# insertAt

Inserts items at the given index into the given array.

## Parameters

- **arr** `T[]` — The source array.
- **index** `number` — The index to insert items at.
- **options** `InsertAtOptions<T>` _(optional)_ — The items to insert.

## Returns

`T[]` — A new array with the inserted items.

## Example

```js
insertAt([1, 2, 3], 1, { items: [5] }); //=> [1, 5, 2, 3]
insertAt([1, 2, 3], 0, { items: [5, 6] }); //=> [5, 6, 1, 2, 3]
```
