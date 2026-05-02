# dropWhile

Creates a slice of array with elements dropped from the beginning while the predicate returns true.

@param {T[]} arr The source array.
@param {Function} predicate The function invoked per element.
@returns {T[]} A new array with dropped elements removed.

### Example

```js
dropWhile([1, 2, 3, 4, 5], (n) => n < 3) //=> [3, 4, 5]
dropWhile([1, 2, 3], (n) => n > 3) //=> [1, 2, 3]
```
