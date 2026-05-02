# rateLimitRun

Creates a rate-limited function that ensures it only runs a specific number of times
within a rolling time window.

### Example

```js
const run = rateLimitRun(async (val) => val, 2, 1000); // 2 per second
run('a'); // runs immediately
run('b'); // runs immediately
run('c'); // waits until 1s after 'a' started
```
