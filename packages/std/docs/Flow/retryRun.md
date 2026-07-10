# retryRun

Retries an asynchronous function according to the specified options.

`retries` must be a non-negative integer, `delay` must be a non-negative finite
number, and `backoff` must be either `'fixed'` or `'exponential'`.

@param {Function} func The async function to retry.
@param {Object} [options] The retry options.
@returns {Promise<T>} A promise that resolves to the function result.

### Example

```js
const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
```
