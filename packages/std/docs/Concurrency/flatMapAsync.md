# flatMapAsync

Asynchronous version of `Array.prototype.flatMap`.
By default, it runs all iterations in parallel.

The optional third argument is an options object: `{ concurrency }` limits the
number of callbacks running at once. It defaults to `Infinity`.

## Example

```js
await flatMapAsync([1, 2, 3], async (n) => [n, n * 2]) //=> [1, 2, 2, 4, 3, 6]
await flatMapAsync([1, 2, 3], async (n) => [n, n * 2], { concurrency: 2 }) //=> [1, 2, 2, 4, 3, 6]
```
