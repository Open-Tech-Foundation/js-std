# findLastIndexIter

Finds the index of the last item in an iterator that matches a predicate.

@param {Iterable<T>} iter The iterable to search.
@param {(val: T) => boolean} fn The predicate function.
@returns {number} The index of the last matching item, or -1.

### Example

```js
findLastIndexIter([1, 2, 3, 2], x => x === 2) //=> 3
```
