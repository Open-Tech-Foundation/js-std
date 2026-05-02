# unzip

Creates an array of ungrouped elements, the first of which contains the first elements of each group,
the second of which contains the second elements of each group, and so on.

@param {T[][]} zipped The zipped array to unzip.
@returns {T[][]} A new array of arrays.

### Example

```js
unzip([[1, 'a'], [2, 'b']]) //=> [[1, 2], ['a', 'b']]
```
