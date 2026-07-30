# zipIter

Returns a Generator that yields one group per position, taking one item from
each iterable.

Runs until every source is exhausted, padding the ones that finished early with
`undefined`, which is what `zip` does for arrays. That means an infinite source
never lets it end — pair it with `takeIter`.

Each source is advanced exactly once per group and never read ahead, so the
items sit in memory one row at a time. The sources are closed when the consumer
stops early.

@param {...Iterable<T>} iterables The iterables to zip.
@returns {Generator<(T|undefined)[]>} A new generator of groups.

### Example

```js
const it = zipIter([1, 2], ['a', 'b']);
[...it] //=> [[1, 'a'], [2, 'b']]

[...zipIter([1, 2, 3], ['a'])] //=> [[1, 'a'], [2, undefined], [3, undefined]]
```
