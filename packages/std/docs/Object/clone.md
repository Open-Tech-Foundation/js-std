# clone

Creates a fast deep clone for supported built-in container and value types.

Supported deep-clone cases include plain objects, arrays, maps, sets, dates,
errors, regular expressions, array buffers, typed arrays, data views, and
circular references.

For supported `Error` values, `name`, `message`, `stack`, `cause`, and custom
own enumerable properties are preserved. Nested `cause` values are cloned when
they are themselves supported clone inputs.

Functions and unsupported object instances are preserved by reference instead of
being generically cloned. This utility is intended for fast application-level
deep cloning, not as a full replacement for `structuredClone`.

### Example

```js
const obj1 = {a: 1, b: ['x']}
const obj2 = clone(obj1)
obj1 === obj2 //=> false
obj1.b === obj2.b //=> false
```
