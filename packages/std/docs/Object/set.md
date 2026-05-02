# set

Sets the value to an object at the given path.

@param {T} obj The object to modify.
@param {string|Array} path The path of the property to set.
@param {unknown|Function} value The value to set or a function to produce it.
@returns {T} The modified object.

### Example

```js
set({}, 'a.b', 1) //=> {a: {b: 1} }
```
