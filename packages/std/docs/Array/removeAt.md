# removeAt

Removes items at the given index from the given array.

## Parameters

- **arr** `T[]` — The source array.
- **index** `number` — The index to remove items from.
- **count** `number` — The number of items to remove (default 1).

## Returns

`T[]` — A new array with the removed items.

## Example

```js
removeAt([1, 2, 3], 1); //=> [1, 3]
removeAt([1, 2, 3, 4], 1, 2); //=> [1, 4]
```
