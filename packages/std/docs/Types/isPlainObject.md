# isPlainObject

Checks if the given value is a plain object (i.e., created via `{}` or `Object.create(null)`).

### Example

```js

isPlainObject({}) //=> true

isPlainObject([]) //=> false

isPlainObject(Object.create(null)) //=> true

isPlainObject(new Map()) //=> false

isPlainObject(null) //=> false
```
