# isUnorderedEqual

Checks deeply if the given two arrays with different orders are equivalent.

@param {unknown[]} arr1 The first array to compare.
@param {unknown[]} arr2 The second array to compare.
@returns {boolean} True if equivalent, false otherwise.

### Example

```js
isUnorderedEqual([1, 3, 2], [2, 1, 3]) //=> true
isUnorderedEqual([1, 3, 2], [2, 1, 5]) //=> false
```
