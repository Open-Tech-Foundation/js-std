# replaceAt

Replaces items at the given index in the given array.

## Parameters

- **arr** `T[]` — The source array.
- **index** `number` — The index to replace items at.
- **items** `T[]` — The items to replace with.

## Returns

`T[]` — A new array with the replaced items.

## Example

```js
replaceAt([1, 2, 3], 1, 5); //=> [1, 5, 3]
replaceAt([1, 2, 3], 1, 5, 6); //=> [1, 5, 6, 3]
```
