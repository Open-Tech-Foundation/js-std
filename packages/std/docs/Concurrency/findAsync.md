# findAsync

Asynchronous version of `Array.prototype.find`.
By default, it runs all iterations in parallel.

The result is the earliest match by index, not the first predicate to resolve.
Those are the same thing only when running one at a time: with several in
flight a later element can settle first, and returning it would make the answer
depend on how fast each callback happened to be.

Elements at or beyond a known match are never started, since they cannot
improve on it, but everything before one is awaited — any of those could still
turn out to be the earlier match.

Sparse array holes are visited and seen as `undefined`, matching native
`Array.prototype.find()` behavior.

@param {T[]} arr The source array.
@param {Function} cb The async predicate to run for each element.
@param {number} [concurrency=Infinity] The maximum number of concurrent executions.
@returns {Promise<T|undefined>} The first matching element, or `undefined`.

### Example

```js
await findAsync([1, 2, 3], async (n) => n > 1) //=> 2

await findAsync(urls, async (url) => (await fetch(url)).ok, 4) //=> 'https://…'
```
