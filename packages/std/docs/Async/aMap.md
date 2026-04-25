# aMap

Array map with `Async` callback function.

### Example

```js
await aMap([1, 2, 3], (n) => await someDelayedFn(n))
```
