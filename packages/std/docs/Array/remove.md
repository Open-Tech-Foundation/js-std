# remove

Removes items at the given index or all elements matching the predicate.

@param {T[]} arr The source array.
@param {number|Function} indexOrFn The index or predicate function.
@param {number} count The number of items to remove (ignored when using predicate).
@returns {T[]} A new array with the removed items.

### Example

```js
remove([1, 2, 3], 1, 2); //=> [1]
remove([1, 2, 3, 4, 5], (x) => x % 2 === 0); //=> [1, 3, 5]
```
