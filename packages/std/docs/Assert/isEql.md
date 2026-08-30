<!-- handwritten -->

# isEql

Checks deeply if the given two values are equivalent.

For supported `Map` values, entry order still matters, but object keys are
compared structurally instead of by reference. `Set` values are compared in
iteration order too — use [isUnorderedEqual](./isUnorderedEqual.md) where the
order is not meant to be part of the value. Symbol-keyed own properties are
also included in deep comparisons and shallow object comparisons.

Circular structures are compared correctly, whichever kind of container closes
the loop. A pair of values already being compared further up the walk is taken
as equal, so two graphs with the same shape match and the comparison never runs
away; merely sharing a node is not enough to be called a cycle.

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
