<!-- handwritten -->

# chunkIter

Returns a Generator that yields the items in groups of a specified size.

Only one group is held at a time, so this works on a source too large to
collect — the reason to reach for it over `chunk`, which needs the whole array
up front. A trailing group shorter than `size` is still yielded.

`size` is checked when `chunkIter` is called, not on the first pull: a
generator body does not run until then, and a bad argument should throw while
the call that made it is still on the stack.

## Parameters

- **iterable** `Iterable<T>` — The source iterable.
- **size** `number` _(default: `1`)_ — The length of each group.

## Returns

`Generator<T[]>` — A new generator of groups.

## Throws

- `Error` — If `size` is not an integer greater than zero.

## Example

```js
const it = chunkIter([1, 2, 3, 4, 5], 2);
[...it] //=> [[1, 2], [3, 4], [5]]
```
