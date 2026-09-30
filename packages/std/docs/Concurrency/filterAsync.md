# filterAsync

Asynchronous version of `Array.prototype.filter`.
By default, it runs all iterations in parallel.

The optional third argument is an options object: `{ concurrency }` limits the
number of callbacks running at once. It defaults to `Infinity`.

## Example

```js
await filterAsync([1, 2, 3], async (n) => n > 1) //=> [2, 3]
await filterAsync([1, 2, 3], async (n) => n > 1, { concurrency: 2 }) //=> [2, 3]
```
