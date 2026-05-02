# toArrayIterAsync

Collects all items from an async iterator into an array.

@param {AsyncIterable<T>} iter The async iterable to collect.
@returns {Promise<T[]>} A promise that resolves to an array of all items.

### Example

```js
async function* gen() { yield 1; yield 2; }
await toArrayIterAsync(gen()) //=> [1, 2]
```
