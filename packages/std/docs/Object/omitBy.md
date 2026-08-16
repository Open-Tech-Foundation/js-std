<!-- handwritten -->

# omitBy

Creates an object composed of the keys that the predicate returns falsy for.

When the source object uses `Object.create(null)`, the returned object preserves
that null prototype. Enumerable symbol keys are also evaluated by the
predicate.

`__proto__`, `constructor` and `prototype` are skipped regardless of the
predicate, as they are everywhere in this module.

## Example

```js
omitBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { b: '2' }
```
