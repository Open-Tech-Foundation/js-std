# aPipeFn

Returns a function that performs functions composition from left to right asynchronously.

### Example

```js
const transform = aPipe((x) => Promise.resolve(x ** 2), (x) => Promise.resolve(x - 5))
await transform(5) //=> 20
```
