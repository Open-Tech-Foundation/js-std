# chunk

Splits an array into groups of a specified size.

## Parameters

- **arr** `T[]` — The source array.
- **size** `number` — The length of each chunk.

## Returns

`T[][]` — A new array containing the chunks.

## Example

```js
chunk(['a', 'b', 'c', 'd'], 2) //=> [['a', 'b'], ['c', 'd']]
chunk(['a', 'b', 'c', 'd'], 3) //=> [['a', 'b', 'c'], ['d']]
```
