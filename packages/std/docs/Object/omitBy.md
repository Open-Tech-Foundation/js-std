# omitBy

Creates an object composed of the keys that the predicate returns falsy for.

### Example

```js
omitBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { b: '2' }
```
