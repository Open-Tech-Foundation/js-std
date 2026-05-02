# insert

Inserts items at the given index or before/after the first element matching the predicate.

@param {T[]} arr The source array.
@param {number|Function} indexOrFn The index or predicate function.
@param {T[]} items The items to insert.
@param {string} position Insert before or after the match (default 'before').
@returns {T[]} A new array with the inserted items.

### Example

```js
insert([1, 2, 3], 1, 5); //=> [1, 5, 2, 3]
insert([1, 2, 3], (x) => x === 2, 5); //=> [1, 5, 2, 3]
insert([1, 2, 3], (x) => x === 2, 5, 'after'); //=> [1, 2, 5, 3]
```
