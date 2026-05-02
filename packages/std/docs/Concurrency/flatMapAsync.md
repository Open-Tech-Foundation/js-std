# flatMapAsync

Asynchronous version of `Array.prototype.flatMap`.
By default, it runs all iterations in parallel.

### Example

```js
await flatMapAsync([1, 2, 3], async (n) => [n, n * 2]) //=> [1, 2, 2, 4, 3, 6]
```
