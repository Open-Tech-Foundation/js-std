# filterIter

Filters items in an iterator based on a predicate.

@param {Iterable<T>} iter The iterable to filter.
@param {(val: T) => boolean} fn The predicate function.
@returns {IterableIterator<T>} A new iterable iterator.

### Example

```js
const evens = filterIter([1, 2, 3, 4], x => x % 2 === 0);
[...evens] //=> [2, 4]
```
