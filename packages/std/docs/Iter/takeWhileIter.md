# takeWhileIter

Returns a generator that yields items from an iterable as long as a predicate is true.

@param {Iterable<T>} iter The iterable to take from.
@param {(val: T) => boolean} fn The predicate function.
@returns {IterableIterator<T>} A new iterable iterator.

### Example

```js
const it = takeWhileIter([1, 2, 3, 4], x => x < 3);
[...it] //=> [1, 2]
```
