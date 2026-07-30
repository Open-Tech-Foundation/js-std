# set

Sets the value to an object at the given path.

Missing intermediate branches are created automatically. If an existing
intermediate value is non-object-like, such as `0`, `false`, `''`, or `null`,
the operation is ignored instead of overwriting that value.

Passing a function makes it an updater: it receives the current value at the
path and its result is stored. There is no type that distinguishes the two —
a function is a perfectly good value to store — so `value` is `unknown` and
the form is chosen at run time.

@param {T} obj The object to modify.
@param {PropertyPath} path The path of the property to set.
@param {unknown} value The value to set, or a function to produce it.
@returns {T} The modified object.

### Example

```js
set({}, 'a.b', 1) //=> {a: {b: 1} }

set({ a: 1 }, 'a', (n) => n + 1) //=> { a: 2 }
```
