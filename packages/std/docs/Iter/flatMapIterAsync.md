# flatMapIterAsync

Maps each item in an async iterator and flattens the result.

@param {AsyncIterable<T>} iter The async iterable to transform.
@param {(val: T) => AsyncIterable<U> | Iterable<U> | Promise<AsyncIterable<U> | Iterable<U>>} fn The mapper function.
@returns {AsyncIterableIterator<U>} A new async iterable iterator.

### Example

```js
async function* gen() { yield 1; yield 2; }
const flattened = flatMapIterAsync(gen(), x => [x, x * 10]);
for await (const x of flattened) { console.log(x); } //=> 1, 10, 2, 20
```
