# idleRun

Creates a debounced version of a function that delays execution until after a period of inactivity.

### Example

```js
const run = idleRun((val) => console.log(val), 500);
run("a");
run("b");
run("c"); // Only this one executes after 500ms
```
