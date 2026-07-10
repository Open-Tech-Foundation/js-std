# isJSON

Checks whether the given value is a valid JSON string.

### Syntax

```ts
isJSON(val: unknown): boolean
```

### Example

```js

isJSON("null") //=> true

isJSON("[]") //=> true

isJSON("{}") //=> true

isJSON('"hello"') //=> true

isJSON({}) //=> false
```
