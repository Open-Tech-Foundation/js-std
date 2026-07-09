# isJSON

Checks whether the given value is a valid JSON plain object string.

### Syntax

```ts
isJSON(val: unknown): boolean
```

### Example

```js

isJSON("null") //=> false

isJSON("[]") //=> false

isJSON("{}") //=> true

isJSON({}) //=> false
```
