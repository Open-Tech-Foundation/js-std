# someIterAsync

Checks if any item in an async iterator matches a predicate.

@param {AsyncIterable<T>} iter The async iterable to check.
@param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
@returns {Promise<boolean>} A promise that resolves to true if any item matches, else false.

### Example

```js
async function* gen() { yield 1; yield 2; }
await someIterAsync(gen(), x => x > 1) //=> true
```
