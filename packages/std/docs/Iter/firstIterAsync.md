# firstIterAsync

Returns the first item from an async iterable.

@param {AsyncIterable<T>} iter The async iterable to search.
@returns {Promise<T | undefined>} A promise that resolves to the first item, or undefined.

### Example

```js
async function* gen() { yield 1; yield 2; }
await firstIterAsync(gen()) //=> 1
```
