# findLastIter

Finds the last item in an iterator that matches a predicate.

@param {Iterable<T>} iter The iterable to search.
@param {(val: T) => boolean} fn The predicate function.
@returns {T | undefined} The last matching item, or undefined.

### Example

```js
findLastIter([1, 2, 3, 2], x => x === 2) //=> 2 (the second one)
```
