# eachAsync

Asynchronous version of `Array.prototype.forEach`.
By default, it runs all iterations in parallel.

The optional third argument is an options object: `{ concurrency }` limits the
number of callbacks running at once. It defaults to `Infinity`.

## Example

```js
await eachAsync([1, 2, 3], async (n) => console.log(n))
await eachAsync([1, 2, 3], async (n) => console.log(n), { concurrency: 2 })
```
