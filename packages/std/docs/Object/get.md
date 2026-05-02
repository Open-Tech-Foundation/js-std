# get

Gets the value of an object at the given path.

@param {Object} obj The object to query.
@param {string|Array} path The path of the property to get.
@param {unknown} [defVal] The value returned for undefined resolved values.
@returns {unknown} The resolved value.

### Example

```js
get({a: {b: {c: 1}}}, 'a.b.c') //=> 1
```
