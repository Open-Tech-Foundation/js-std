# everyAsync

Asynchronous version of `Array.prototype.every`.
By default, it runs all iterations in parallel.

Once an element fails the predicate no further ones are started, though those
already running are awaited — there is no way to recall work already handed to
the callback. An empty array is vacuously `true`.

Sparse array holes are skipped, matching native `Array.prototype.every()`
behavior.

@param {T[]} arr The source array.
@param {Function} cb The async predicate to run for each element.
@param {number} [concurrency=Infinity] The maximum number of concurrent executions.
@returns {Promise<boolean>} Whether every element satisfied the predicate.

### Example

```js
await everyAsync([2, 4, 6], async (n) => n % 2 === 0) //=> true

await everyAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> false
```
