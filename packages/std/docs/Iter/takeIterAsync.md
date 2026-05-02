# takeIterAsync

Returns an AsyncGenerator that yields the first n items from an AsyncIterable.

@param {AsyncIterable} iterable The source async iterable.
@param {number} n The number of items to take.
@returns {AsyncGenerator} A new async generator with the first n items.

### Example

```js
const it = takeIterAsync(asyncIterable, 2);
for await (const item of it) { ... }
```
