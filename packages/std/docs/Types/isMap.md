# isMap

Checks if the given value is a Map object.

## Example

```js
isMap(new Map()) //=> true

isMap(new WeakMap()) //=> false

isMap({}) //=> false

Checked by probing the internal slot rather than by reading the object's
`Object.prototype.toString` tag, which any object can set for itself with
`Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
and the slot cannot be faked. It works across realms either way.
```
