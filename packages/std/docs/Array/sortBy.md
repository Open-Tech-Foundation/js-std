# sortBy

Sorts an array of objects by one or more criteria.

@param {T[]} arr The source array.
@param {OrderTuples} tuples The criteria to sort by.
@returns {T[]} A new sorted array.

### Example

```js
const arr = [{a: 1}, {a: 3}, {a: 2}]
sortBy(arr, ['a', 'asc']); //=> [{a: 1}, {a: 2}, {a: 3}]
```
