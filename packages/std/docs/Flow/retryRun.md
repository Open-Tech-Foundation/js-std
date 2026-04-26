# retryRun

Retries an asynchronous function according to the specified options.

### Example

```js
const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
```
