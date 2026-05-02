# paceRun

Creates a throttled function that only invokes `func` at most once per
every `interval` milliseconds.

### Example

```js
const run = paceRun((val) => console.log(val), 500);
run('a');
run('b');
// => logs 'a' immediately, ignores 'b'
```
