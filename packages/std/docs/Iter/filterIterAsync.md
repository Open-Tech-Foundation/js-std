# filterIterAsync

Filters items in an async iterator based on a predicate.

@param {AsyncIterable<T>} iter The async iterable to filter.
@param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
@returns {AsyncIterableIterator<T>} A new async iterable iterator.

### Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
const evens = filterIterAsync(gen(), x => x % 2 === 0);
for await (const x of evens) { console.log(x); } //=> 2
```
