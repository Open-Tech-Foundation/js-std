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

A numeric segment creates an array only up to `MAX_ARRAY_INDEX` (10,000). Above
that the branch becomes a plain object keyed by the number, so the value is
still stored and only the array-ness is dropped. The limit exists because a lone
large index in untrusted input — `a[100000000]` — would otherwise produce an
array whose `length` makes serialising the result cost hundreds of megabytes. A
flattened array starts at `[0]`, so one of any size still round trips.

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
