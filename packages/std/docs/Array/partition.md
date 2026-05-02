# partition

Creates an array of elements split into two groups: those that pass the predicate and those that don't.

@param {T[]} arr The source array.
@param {Function} predicate The function invoked per element.
@returns {[T[], T[]]} A tuple of [passing, failing] arrays.

### Example

```js
partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)
//=> [[2, 4], [1, 3, 5]]

partition([0, 1, false, 2, '', 3], Boolean)
//=> [[1, 2, 3], [0, false, '']]
```
