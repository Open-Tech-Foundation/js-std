# batchRun

Creates a batched version of a function that collects multiple calls and processes them in a single operation.

### Example

```js
const run = batchRun(async (batch) => {
  return await api.process(batch);
}, { limit: 10, delay: 50 });

run(1);
run(2);
```
