# nthIterAsync

Returns the nth item (0-indexed) from an async iterable.

@param {AsyncIterable<T>} iter The async iterable to search.
@param {number} n The index of the item to return.
@returns {Promise<T | undefined>} A promise that resolves to the nth item, or undefined.

### Example

```js
async function* gen() { yield 1; yield 2; }
await nthIterAsync(gen(), 1) //=> 2
```
