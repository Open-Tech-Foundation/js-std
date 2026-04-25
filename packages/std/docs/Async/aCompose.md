# aCompose

Performs functions composition from right to left asynchronously.

### Example

```js

await aCompose(1, (x) => Promise.resolve(x + 1), (x) => Promise.resolve(x * 5)) //=> 6
```
