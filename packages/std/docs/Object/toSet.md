<!-- handwritten -->

# toSet

Sets the value to an object at the given path & returns new object.

Missing intermediate branches are created automatically. If an existing
intermediate value is non-object-like, such as `0`, `false`, `''`, or `null`,
the operation is ignored and the original value is returned unchanged.

As with `set`, passing a function makes it an updater rather than the value
to store; the two cannot be told apart by type, so `value` is `unknown`.

`__proto__`, `constructor` and `prototype` are refused as path segments.
The path is checked before anything is written, so a path that will be
refused leaves the object exactly as it was — no partial branch.

## Parameters

- **obj** `T` — The object to copy from.
- **path** `PropertyPath` — The path of the property to set.
- **value** `unknown` — The value to set, or a function to produce it.

## Returns

`T` — A new object with the value set.

## Example

```js
toSet({}, 'a.b', 1) //=> {a: {b: 1} }
```
