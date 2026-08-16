# zipIterAsync

Returns an AsyncGenerator that yields one group per position, taking one
item from each async iterable.

The sources are advanced together rather than one after another, so a row
costs the slowest of them rather than the sum — which is the whole reason
to zip streams instead of collecting each one first.

Runs until every source is exhausted, padding the ones that finished early
with `undefined`, which is what `zip` does for arrays. That means an
endless source never lets it end — pair it with `takeIterAsync`.

## Parameters

- **iterables** `...AsyncIterable<T>` — The async iterables to zip.

## Returns

`AsyncGenerator<(T|undefined)[]>` — A new async generator of groups.

## Example

```js
const rows = zipIterAsync(streamToIter(names), streamToIter(scores));
await toArrayIterAsync(rows) //=> [['ann', 9], ['bob', 7]]
```
