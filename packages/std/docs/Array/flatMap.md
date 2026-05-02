# flatMap

Maps each item and flattens the result into a single array.

@param {T[]} arr The source array.
@param {Function} fn The mapper function returning arrays.
@returns {U[]} A new flattened array.

### Example

```js
flatMap([1, 2], (x) => [x, x * 10]) //=> [1, 10, 2, 20]
```
