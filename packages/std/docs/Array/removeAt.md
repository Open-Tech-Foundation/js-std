# removeAt

Removes items at the given index from the given array.

@param {T[]} arr The source array.
@param {number} index The index to remove items from.
@param {number} count The number of items to remove (default 1).
@returns {T[]} A new array with the removed items.

### Example

```js
removeAt([1, 2, 3], 1); //=> [1, 3]
removeAt([1, 2, 3, 4], 1, 2); //=> [1, 4]
```
