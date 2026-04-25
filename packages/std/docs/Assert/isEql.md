# isEql

Checks deeply if the given two values are equivalent.

### Example

```js

isEql({a: [{b: 1}]}, {a: [{b: 1}]}) //=> true

isEql(null, undefined) //=> false

isEql({a: 1}, {a: 1}, {shallow: true}) //=> true
```
