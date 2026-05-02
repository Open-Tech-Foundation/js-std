# findIterAsync

Finds the first item in an async iterator that matches a predicate.

@param {AsyncIterable<T>} iter The async iterable to search.
@param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
@returns {Promise<T | undefined>} A promise that resolves to the first matching item, or undefined.

### Example

```js
async function* gen() { yield 1; yield 2; }
await findIterAsync(gen(), x => x > 1) //=> 2
```
