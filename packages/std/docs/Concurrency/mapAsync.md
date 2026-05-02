# mapAsync

Asynchronous version of `Array.prototype.map`.

@param {T[]} arr The source array.
@param {Function} cb The async callback to run for each element.
@param {number} [concurrency=Infinity] The maximum number of concurrent executions.
@returns {Promise<R[]>} A promise that resolves to the new array.

### Example

```js
await mapAsync([1, 2, 3], async (n) => n * 2) //=> [2, 4, 6]
```
