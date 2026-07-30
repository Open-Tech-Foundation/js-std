# toSet

Sets the value to an object at the given path & returns new object.

Missing intermediate branches are created automatically. If an existing
intermediate value is non-object-like, such as `0`, `false`, `''`, or `null`,
the operation is ignored and the original value is returned unchanged.

As with `set`, passing a function makes it an updater rather than the value
to store; the two cannot be told apart by type, so `value` is `unknown`.

@param {T} obj The object to copy from.
@param {PropertyPath} path The path of the property to set.
@param {unknown} value The value to set, or a function to produce it.
@returns {T} A new object with the value set.

### Example

```js
toSet({}, 'a.b', 1) //=> {a: {b: 1} }
```
