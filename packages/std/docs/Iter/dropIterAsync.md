# dropIterAsync

Returns an AsyncGenerator that skips the first n items from an AsyncIterable.

@param {AsyncIterable} iterable The source async iterable.
@param {number} n The number of items to skip.
@returns {AsyncGenerator} A new async generator with the remaining items.

### Example

```js
const it = dropIterAsync(asyncIterable, 1);
for await (const item of it) { ... }
```
