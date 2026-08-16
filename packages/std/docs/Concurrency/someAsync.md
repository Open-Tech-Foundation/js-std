# someAsync

Asynchronous version of `Array.prototype.some`.
By default, it runs all iterations in parallel.

Once an element satisfies the predicate no further ones are started, though
those already running are awaited — there is no way to recall work already
handed to the callback. Sparse holes are skipped, as `Array.prototype.some`
skips them.

## Parameters

- **arr** `T[]` — The source array.
- **cb** `Function` — The async predicate to run for each element.
- **concurrency** `number` _(default: `Infinity`)_ — The maximum number of concurrent executions.

## Returns

`Promise<boolean>` — Whether any element satisfied the predicate.

## Examples

```js
await someAsync([1, 2, 3], async (n) => n > 2) //=> true
```

```js
await someAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> true
```
