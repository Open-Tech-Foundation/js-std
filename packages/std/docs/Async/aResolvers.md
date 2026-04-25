# aResolvers

Creates a promise with custom resolvers for `resolve` and `reject`.

### Example

```js
const { promise, resolve, reject } = Promise.withResolvers();
Math.random() > 0.5 ? resolve("ok") : reject("not ok");
```
