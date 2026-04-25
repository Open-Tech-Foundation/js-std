# has

Checks if the given path exists in the given object.

### Example

```js
has({a: 1}, 'a') //=> true
has({a: {b: 2}}, ['a', 'b']) //=> true
has({a: {b: 2}}, ['a', 'b', 'c']) //=> false
```
