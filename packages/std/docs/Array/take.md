# take

Creates a slice of array with n elements taken from the beginning.

@param {T[]} arr The source array.
@param {number} limit The number of elements to take.
@param {Function} cb The callback to test elements.
@returns {T[]} A new array with taken elements.

### Example

```js
take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
```
