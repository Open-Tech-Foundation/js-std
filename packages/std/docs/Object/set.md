<!-- handwritten -->

# set

Sets the value to an object at the given path.

Missing intermediate branches are created automatically. If an existing
intermediate value is non-object-like, such as `0`, `false`, `''`, or `null`,
the operation is ignored instead of overwriting that value.

Passing a function makes it an updater: it receives the current value at the
path and its result is stored. There is no type that distinguishes the two —
a function is a perfectly good value to store — so `value` is `unknown` and
the form is chosen at run time.

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

- **obj** `T` — The object to modify.
- **path** `PropertyPath` — The path of the property to set.
- **value** `unknown` — The value to set, or a function to produce it.

## Returns

`T` — The modified object.

## Example

```js
set({}, 'a.b', 1) //=> {a: {b: 1} }

set({ a: 1 }, 'a', (n) => n + 1) //=> { a: 2 }
```
