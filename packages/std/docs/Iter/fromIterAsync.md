# fromIterAsync

Creates an AsyncIterableIterator from an iterable, async iterable, or iterator-like object.

Equivalent to `AsyncIterator.from(O)` proposal.

If the source iterator exposes `return()` or `throw()`, the wrapped async
iterator forwards those methods so early loop exit and errors can close the
underlying iterator correctly.

@param {AsyncIterable<T> | Iterable<T> | { next: () => Promise<IteratorResult<T>> | IteratorResult<T> }} iter The source object.
@returns {AsyncIterableIterator<T>} A new async iterable iterator.

### Example

```js
const it = fromIterAsync([1, 2, 3]);
for await (const x of it) { console.log(x); } //=> 1, 2, 3
```
