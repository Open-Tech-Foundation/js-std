<!-- handwritten -->

# unzip

Creates an array of ungrouped elements, the first of which contains the first elements of each group,
the second of which contains the second elements of each group, and so on.

## Parameters

- **zipped** `(T | undefined)[][]` — The zipped array to unzip.

## Returns

`(T | undefined)[][]` — A new array of arrays.

Jagged input groups preserve their missing positions as `undefined`.

## Example

```js
unzip([[1, 'a'], [2, 'b']]) //=> [[1, 2], ['a', 'b']]
unzip([[1, 'a'], [2]]) //=> [[1, 2], ['a', undefined]]
```
