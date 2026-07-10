# filterAsync

Asynchronous version of `Array.prototype.filter`.
By default, it runs all iterations in parallel.

Sparse array holes are skipped, matching native `Array.prototype.filter()`
behavior.

### Example

```js
await filterAsync([1, 2, 3], async (n) => n > 1) //=> [2, 3]
```
