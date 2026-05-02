# range

Creates an array of numbers progressing from start up to, but not including, end.

@param {number} start The start of the range.
@param {number} end The end of the range.
@param {number|Object} options The step or options object.
@returns {number[]} A new array of numbers.

### Example

```js
range(4) //=> [0, 1, 2, 3]
range(-4) //=> [0, -1, -2, -3]
range(1, 5) //=> [1, 2, 3, 4]
range(0, 20, 5) //=> [0, 5, 10, 15]
range(1, 4, {step: 1, inclusiveEnd: true}) //=> [1, 2, 3, 4]
```
