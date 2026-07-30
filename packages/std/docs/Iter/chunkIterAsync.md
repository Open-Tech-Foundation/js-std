# chunkIterAsync

Returns an AsyncGenerator that yields the items in groups of a specified size.

Only one group is held at a time, so this works on a stream too large to
collect — batching rows for an insert, or bytes for a write. A trailing group
shorter than `size` is still yielded.

`size` is checked when `chunkIterAsync` is called, not on the first pull.

@param {AsyncIterable<T>} iterable The source async iterable.
@param {number} [size=1] The length of each group.
@returns {AsyncGenerator<T[]>} A new async generator of groups.
@throws {Error} If `size` is not an integer greater than zero.

### Example

```js
for await (const batch of chunkIterAsync(rows, 500)) {
  await db.insertMany(batch);
}
```
