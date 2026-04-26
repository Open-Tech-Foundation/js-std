# timeoutRun

Enforces a time limit on an asynchronous function.

### Example

```js
const result = await timeoutRun(() => fetchLargeData(), 1000);
```
