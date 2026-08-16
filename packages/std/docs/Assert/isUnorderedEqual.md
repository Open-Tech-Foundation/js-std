# isUnorderedEqual

Checks deeply if the given two arrays with different orders are equivalent.

## Parameters

- **arr1** `unknown[]` — The first array to compare.
- **arr2** `unknown[]` — The second array to compare.

## Returns

`boolean` — True if equivalent, false otherwise.

## Example

```js
isUnorderedEqual([1, 3, 2], [2, 1, 3]) //=> true
isUnorderedEqual([1, 3, 2], [2, 1, 5]) //=> false
```
