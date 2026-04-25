# aForEach

Array forEach with `Async` callback function.

### Example

```js

await aForEach([1, 3, 5], async () => await someDelayedFn())
```
