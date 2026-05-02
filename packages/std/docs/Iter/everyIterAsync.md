# everyIterAsync

Checks if all items in an async iterator match a predicate.

@param {AsyncIterable<T>} iter The async iterable to check.
@param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
@returns {Promise<boolean>} A promise that resolves to true if all items match, else false.

### Example

```js
async function* gen() { yield 1; yield 2; }
await everyIterAsync(gen(), x => x > 0) //=> true
```
