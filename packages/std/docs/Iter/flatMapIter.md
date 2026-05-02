# flatMapIter

Maps each item in an iterator and flattens the result.

@param {Iterable<T>} iter The iterable to transform.
@param {(val: T) => Iterable<U>} fn The mapper function returning iterables.
@returns {IterableIterator<U>} A new iterable iterator.

### Example

```js
const flattened = flatMapIter([1, 2], x => [x, x * 10]);
[...flattened] //=> [1, 10, 2, 20]
```
