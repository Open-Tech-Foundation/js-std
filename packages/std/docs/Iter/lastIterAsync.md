# lastIterAsync

Returns the last item from an async iterable.

@param {AsyncIterable<T>} iter The async iterable to search.
@returns {Promise<T | undefined>} A promise that resolves to the last item, or undefined.

### Example

```js
async function* gen() { yield 1; yield 2; }
await lastIterAsync(gen()) //=> 2
```
