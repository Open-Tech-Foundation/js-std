# findLastIndexIterAsync

Finds the index of the last item in an async iterator that matches a predicate.

@param {AsyncIterable<T>} iter The async iterable to search.
@param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
@returns {Promise<number>} A promise that resolves to the index of the last matching item, or -1.

### Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
await findLastIndexIterAsync(gen(), x => x < 3) //=> 1
```
