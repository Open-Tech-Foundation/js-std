# eachAsync

Asynchronous version of `Array.prototype.forEach`.
By default, it runs all iterations in parallel.

### Example

```js
await eachAsync([1, 2, 3], async (n) => console.log(n))
```
