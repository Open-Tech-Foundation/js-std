# isDate

Checks if the given value is a valid date object.

## Example

```js
isDate(new Date()) //=> true

isDate(new Date('')) //=> false

isDate('2000-01-01') //=> false

Checked by probing the internal slot rather than by reading the object's
`Object.prototype.toString` tag, which any object can set for itself with
`Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
and the slot cannot be faked. It works across realms either way.
```
