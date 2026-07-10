# takeWhile

Creates a slice of array with elements taken from the beginning or end while the predicate returns true.

@param {T[]} arr The source array.
@param {Function} predicate The function invoked per element.
@param {boolean} right If true, takes from the end.
@returns {T[]} A new array with taken elements.

### Example

```js
takeWhile([1, 2, 3, 4, 5], (n) => n < 4) //=> [1, 2, 3]
takeWhile([1, 2, 3], (n) => n > 3) //=> []
takeWhile([1, 2, 3, 4, 5], (n) => n > 3, true) //=> [4, 5]
```
