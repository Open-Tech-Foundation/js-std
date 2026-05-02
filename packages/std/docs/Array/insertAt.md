# insertAt

Inserts items at the given index into the given array.

@param {T[]} arr The source array.
@param {number} index The index to insert items at.
@param {T[]} items The items to insert.
@returns {T[]} A new array with the inserted items.

### Example

```js
insertAt([1, 2, 3], 1, 5); //=> [1, 5, 2, 3]
insertAt([1, 2, 3], 0, 5, 6); //=> [5, 6, 1, 2, 3]
```
