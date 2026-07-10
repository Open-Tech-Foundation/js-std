# timeoutRun

Enforces a time limit on an asynchronous function.

`ms` must be a non-negative finite number.

@param {Function} func The async function to run.
@param {number} ms The timeout in milliseconds.
@param {Object} [options] The timeout options.
@returns {Promise<T>} A promise that resolves to the function result.

### Example

```js
const result = await timeoutRun(() => fetchLargeData(), 1000);
```
