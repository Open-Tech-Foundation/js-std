# findIter

Finds the first item in an iterator that matches a predicate.

@param {Iterable<T>} iter The iterable to search.
@param {(val: T) => boolean} fn The predicate function.
@returns {T | undefined} The first matching item, or undefined.

### Example

```js
findIter([1, 2, 3], x => x > 1) //=> 2
```
