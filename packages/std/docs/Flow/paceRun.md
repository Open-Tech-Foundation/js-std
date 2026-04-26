# paceRun

Creates a throttled version of a function that only invokes the original function at most once per every `interval` milliseconds.

### Example

```js
const run = paceRun((val) => console.log(val), 1000);
run(1); // Executes immediately
run(2); // Queued, runs after 1s
```
