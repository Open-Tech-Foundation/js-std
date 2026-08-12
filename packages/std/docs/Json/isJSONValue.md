# isJSONValue

Checks whether `val` is a valid JSON value — `string`, finite `number`, `boolean`, `null`, arrays of JSON values, or plain objects with JSON values.

### Syntax

```ts
isJSONValue(val: unknown): val is JsonValue
```

### Example

```js
isJSONValue({a:1}) //=> true
isJSONValue([1, "a", null]) //=> true
isJSONValue(BigInt(1)) //=> false
isJSONValue(NaN) //=> false
```
