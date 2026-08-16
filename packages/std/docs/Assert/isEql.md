<!-- handwritten -->

# isEql

Checks deeply if the given two values are equivalent.

For supported `Map` values, entry order still matters, but object keys are
compared structurally instead of by reference. Symbol-keyed own properties are
also included in deep comparisons and shallow object comparisons.

## Parameters

- **val1** `unknown` — The first value to compare.
- **val2** `unknown` — The second value to compare.
- **options** `Object` _(optional)_ — The options object.

## Returns

`boolean` — True if values are equivalent, false otherwise.

## Example

```js
isEql({a: [{b: 1}]}, {a: [{b: 1}]}) //=> true
isEql(null, undefined) //=> false
```
