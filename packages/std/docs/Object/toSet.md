# toSet

Sets the value to an object at the given path & returns new object.

Missing intermediate branches are created automatically. If an existing
intermediate value is non-object-like, such as `0`, `false`, `''`, or `null`,
the operation is ignored and the original value is returned unchanged.

### Example

```js
toSet({}, 'a.b', 1) //=> {a: {b: 1} }
```
