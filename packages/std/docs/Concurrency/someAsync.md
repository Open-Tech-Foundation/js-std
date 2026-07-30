# someAsync

Asynchronous version of `Array.prototype.some`.
By default, it runs all iterations in parallel.

Once an element satisfies the predicate no further ones are started, though
those already running are awaited — there is no way to recall work already
handed to the callback.

Sparse array holes are skipped, matching native `Array.prototype.some()`
behavior.

@param {T[]} arr The source array.
@param {Function} cb The async predicate to run for each element.
@param {number} [concurrency=Infinity] The maximum number of concurrent executions.
@returns {Promise<boolean>} Whether any element satisfied the predicate.

### Example

```js
await someAsync([1, 2, 3], async (n) => n > 2) //=> true

await someAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> true
```
