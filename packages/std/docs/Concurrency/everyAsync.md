# everyAsync

Asynchronous version of `Array.prototype.every`.
By default, it runs all iterations in parallel.

Once an element fails the predicate no further ones are started, though
those already running are awaited — there is no way to recall work already
handed to the callback. Sparse holes are skipped, as `Array.prototype.every`
skips them, and an empty array is vacuously `true`.

## Parameters

- **arr** `T[]` — The source array.
- **cb** `Function` — The async predicate to run for each element.
- **concurrency** `number` _(default: `Infinity`)_ — The maximum number of concurrent executions.

## Returns

`Promise<boolean>` — Whether every element satisfied the predicate.

## Examples

```js
await everyAsync([2, 4, 6], async (n) => n % 2 === 0) //=> true
```

```js
await everyAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> false
```
