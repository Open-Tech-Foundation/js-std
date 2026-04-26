# rateLimitRun

Creates a rate-limited version of a function that ensures it only runs a specific number of times within a rolling time window.

### Example

```js
const run = rateLimitRun(async (val) => val, 5, 1000);
run(1);
```
