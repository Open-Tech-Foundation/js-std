# toAsyncIter

Converts a sync iterable to an async iterable.

Equivalent to `Iterator.prototype.toAsync()` proposal.

@param {Iterable<T>} iter The sync iterable to convert.
@returns {AsyncIterableIterator<T>} A new async iterable iterator.

### Example

```js
const asyncIter = toAsyncIter([1, 2, 3]);
for await (const x of asyncIter) { console.log(x); } //=> 1, 2, 3
```
