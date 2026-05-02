# replace

Replaces items at the given index or all elements matching the predicate.

@param {T[]} arr The source array.
@param {number|Function} indexOrFn The index or predicate function.
@param {T[]} items The items to replace with.
@returns {T[]} A new array with the replaced items.

### Example

```js
replace([1, 2, 3], 1, 5); //=> [1, 5, 3]
replace([1, 2, 3, 4, 5], (x) => x % 2 === 0, 0); //=> [1, 0, 3, 0, 5]
```
