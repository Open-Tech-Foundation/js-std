# pickBy

Creates an object composed of the keys that the predicate returns truthy for.

### Example

```js
pickBy({ a: 1, b: '2', c: 3 }, isNumber) //=> { a: 1, c: 3 }
```
