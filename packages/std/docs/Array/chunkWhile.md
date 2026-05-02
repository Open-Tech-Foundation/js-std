# chunkWhile

Splits an array into groups where consecutive elements satisfy the grouping predicate.

@param {T[]} arr The source array.
@param {Function} predicate The function that determines if two consecutive elements belong to the same chunk.
@returns {T[][]} A new array containing the chunks.

### Example

```js
chunkWhile([1, 2, 4, 5, 7], (curr, next) => next - curr <= 2)
//=> [[1, 2, 4, 5], [7]]

chunkWhile([1, 1, 2, 3, 5, 5, 6], (a, b) => a === b)
//=> [[1, 1], [2], [3], [5, 5], [6]]
```
