# isPrimitive

Checks if the given value is a primitive.

The seven primitive types are `string`, `number`, `boolean`, `bigint`,
`symbol`, `null` and `undefined`. Everything else is an object, functions
included.

`null` is one of them, despite `typeof null` being `'object'` — a mistake old
enough to be permanent, and the reason a `typeof` check alone gets this wrong.

@param {unknown} val The value to check.
@returns {boolean} `true` if the value is a primitive.

### Example

```js
isPrimitive(1) //=> true

isPrimitive(null) //=> true

isPrimitive({}) //=> false

isPrimitive(() => {}) //=> false
```
