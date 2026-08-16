# sort

Sorts an array of items.

## Parameters

- **arr** `T[]` — The source array.
- **order** `string` _(default: `'asc'`)_ — The sort order ('asc' or 'desc').

## Returns

`T[]` — A new sorted array.

## Example

```js
sort([1, 3, 2]) //=> [1, 2, 3]
sort(['x', 'z', 'y'], 'desc') //=> ['z', 'y', 'x']
```
