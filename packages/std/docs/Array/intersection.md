# intersection

Creates an array of unique values that are included in all given arrays.

@param {T[][]} arr The arrays to intersect.
@param {Function} by The iteratee invoked per element.
@returns {T[]} A new array of intersecting values.

### Example

```js
intersection([[1, 2, 3], [2, 3, 4]]) //=> [2, 3]
intersection([[2.1, 1.2], [2.3, 3.4]], Math.floor) //=> [2.1]
```
