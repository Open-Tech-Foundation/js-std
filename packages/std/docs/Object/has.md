# has

Checks if the given path exists in the given object.

@param {Object} obj The object to query.
@param {string|Array} path The path of the property to check.
@returns {boolean} True if the path exists, false otherwise.

### Example

```js
has({a: 1}, 'a') //=> true
has({a: {b: 2}}, ['a', 'b']) //=> true
```
