# bounds

Returns the minimum and maximum values of the given array.

@param {T[]} arr The source array.
@param {Function} by The iteratee to pick the value.
@returns {[T, T] | null} An array containing the minimum and maximum values.

### Example

```js
bounds([10, 20, 50, 30]) //=> [10, 50]
```
