# isDefined

Checks if the given value is defined.

### Syntax

```ts
isDefined<T>(value: T): value is Exclude<T, undefined>
```

### Example

```js

isDefined() //=> false
isDefined(undefined) //=> false
isDefined(null) //=> true
isDefined('') //=> true
```
