# isJSONValue

Checks whether `val` is a valid JSON value — the values `JSON.stringify`
can represent without loss: `string`, finite `number`, `boolean`, `null`,
arrays of JSON values, and plain objects with JSON values.

`NaN`, `Infinity`, `-Infinity`, `bigint`, `undefined`, `function`, `symbol`,
`Date`, `Map`, `Set`, etc. are not JSON values. `Date` stringifies via
`toJSON` but is not itself a `JsonValue`. Cyclic values return `false`
rather than throwing; shared (diamond) references are allowed.

## Example

```js
isJSONValue({a:1}) //=> true
isJSONValue([1, "a", null]) //=> true
isJSONValue(BigInt(1)) //=> false
isJSONValue(NaN) //=> false
isJSONValue({a: undefined}) //=> false
```
