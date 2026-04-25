# aPipe

Performs functions composition from left to right asynchronously.

### Example

```js
await aPipe(5, (x) => Promise.resolve(x ** 2), (x) => Promise.resolve(x - 5)) //=> 20
```
