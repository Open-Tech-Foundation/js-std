# pickBy

Creates an object composed of the keys that the predicate returns truthy for.

When the source object uses `Object.create(null)`, the returned object preserves
that null prototype.

### Example

```js
pickBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { a: 1, c: 3 }
```
