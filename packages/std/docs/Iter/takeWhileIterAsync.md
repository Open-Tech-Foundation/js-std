# takeWhileIterAsync

Returns an AsyncGenerator that yields items from an AsyncIterable as long as a predicate is true.

@param {AsyncIterable<T>} iter The source async iterable.
@param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
@returns {AsyncIterableIterator<T>} A new async iterable iterator.

### Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
const it = takeWhileIterAsync(gen(), x => x < 3);
for await (const x of it) { console.log(x); } //=> 1, 2
```
