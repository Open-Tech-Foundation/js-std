# omitBy

Creates an object composed of the keys that the predicate returns falsy for.

When the source object uses `Object.create(null)`, the returned object preserves
that null prototype.

### Example

```js
omitBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { b: '2' }
```
