# takeIterAsync

Returns an AsyncGenerator that yields the first n items from an AsyncIterable.

Exactly `n` items are read from the source and no more, so a value the result
does not include is never awaited — which matters when producing one costs a
request. An `n` of zero or less reads nothing at all.

@param {AsyncIterable} iterable The source async iterable.
@param {number} n The number of items to take.
@returns {AsyncGenerator} A new async generator with the first n items.

### Example

```js
const it = takeIterAsync(asyncIterable, 2);
for await (const item of it) { ... }
```
