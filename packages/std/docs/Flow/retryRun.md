# retryRun

Retries an asynchronous function according to the specified options.

`retries` must be a non-negative integer, `delay` must be a non-negative finite
number, and `backoff` must be either `'fixed'` or `'exponential'`.

`onRetry` receives the error as `unknown`, because a rejection can carry any
value, not just an `Error`.

@param {Function} func The async function to retry.
@param {RetryRunOptions} [options] The retry options.
@returns {Promise<T>} A promise that resolves to the function result.

### Example

```js
const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
```
