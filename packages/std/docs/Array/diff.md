# diff

Creates an array with the values of the first array not included in the other arrays.

@param {unknown[][]} collections The arrays to compare.
@param {Function} by The iteratee invoked per element.
@returns {unknown[]} A new array of filtered values.

### Example

```js
diff([[1, 2], [2, 3]]) //=> [1]
diff([[1, "a"], [1, 2]]) //=> ['a']
```
