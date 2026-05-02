# flatten

Flattens an array up to the specified depth.

@param {T[]} arr The source array.
@param {number} depth The maximum recursion depth. Defaults to 1.
@returns {any[]} A new flattened array.

### Example

```js
flatten([1, [2, [3, [4]]]]) //=> [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2) //=> [1, 2, 3, [4]]
flatten([1, [2, [3, [4]]]], Infinity) //=> [1, 2, 3, 4]
```
