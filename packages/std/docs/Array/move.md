# move

Moves an array element from one index position to another.

## Parameters

- **arr** `T[]` — The source array.
- **options** `MoveOptions` — The source and destination indexes.

## Returns

`T[]` — A new array with the moved element.

## Example

```js
move([1, 2, 3], { from: 0, to: 2 }) //=> [2, 3, 1]
```
