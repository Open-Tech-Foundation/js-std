# mapIter

Transforms each item in an iterator using a mapper function.

@param {Iterable<T>} iter The iterable to transform.
@param {(val: T) => U} fn The mapper function.
@returns {IterableIterator<U>} A new iterable iterator.

### Example

```js
const doubled = mapIter([1, 2, 3], x => x * 2);
[...doubled] //=> [2, 4, 6]
```
