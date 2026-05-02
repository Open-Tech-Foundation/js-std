# eachIterAsync

Executes a function for each item in an async iterator.

@param {AsyncIterable<T>} iter The async iterable to iterate over.
@param {(val: T) => void | Promise<void>} fn The function to execute.
@returns {Promise<void>} A promise that resolves when iteration is complete.

### Example

```js
async function* gen() { yield 1; yield 2; }
await eachIterAsync(gen(), x => console.log(x)) //=> Logs 1, 2
```
