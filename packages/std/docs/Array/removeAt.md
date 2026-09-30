# removeAt

Removes items at the given index from the given array.

## Parameters

- **arr** `T[]` — The source array.
- **index** `number` — The index to remove items from.
- **options** `RemoveAtOptions` — The number of items to remove.

## Returns

`T[]` — A new array with the removed items.

## Example

```js
removeAt([1, 2, 3], 1); //=> [1, 3]
removeAt([1, 2, 3, 4], 1, { count: 2 }); //=> [1, 4]
```
