# aComposeFn

Returns a function that performs functions composition from right to left asynchronously.

### Example

```js
const transform = aComposeFn((x) => Promise.resolve(x + 1), (x) => Promise.resolve(x * 5))
await transform(1) //=> 6
```
