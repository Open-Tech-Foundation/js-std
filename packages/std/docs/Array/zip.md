# zip

Creates an array of grouped elements, the first of which contains the first elements of the given arrays,
the second of which contains the second elements of the given arrays, and so on.

## Parameters

- **arrays** `T[][]` — The arrays to zip.

## Returns

`(T | undefined)[][]` — A new zipped array.

## Example

```js
zip([1, 2], ['a', 'b']) //=> [[1, 'a'], [2, 'b']]
zip([1, 2, 3], ['a', 'b']) //=> [[1, 'a'], [2, 'b'], [3, undefined]]
```
