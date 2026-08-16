# isPrimitive

Checks if the given value is a primitive.

The seven primitive types are `string`, `number`, `boolean`, `bigint`,
`symbol`, `null` and `undefined`. Everything else is an object, functions
included.

`null` is one of them, despite `typeof null` being `'object'` — a mistake old
enough to be permanent, and the reason a `typeof` check alone gets this
wrong.

## Parameters

- **val** `unknown` — The value to check.

## Returns

`boolean` — `true` if the value is a primitive.

## Examples

```js
isPrimitive(1) //=> true
```

```js
isPrimitive(null) //=> true
```

```js
isPrimitive({}) //=> false
```

```js
isPrimitive(() => {}) //=> false
```
