# drop

Skips the given number of elements at the start of the given array.

@param {T[]} arr The source array.
@param {number} limit The number of elements to drop.
@param {Function} cb The callback to test elements.
@returns {T[]} A new array with dropped elements.

### Example

```js
drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
```
