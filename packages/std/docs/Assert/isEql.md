# isEql

Checks deeply if the given two values are equivalent.

@param {unknown} val1 The first value to compare.
@param {unknown} val2 The second value to compare.
@param {Object} [options] The options object.
@returns {boolean} True if values are equivalent, false otherwise.

### Example

```js
isEql({a: [{b: 1}]}, {a: [{b: 1}]}) //=> true
isEql(null, undefined) //=> false
```
