# dropIter

Returns a Generator that skips the first n items from an Iterable.

## Parameters

- **iterable** `Iterable` — The source iterable.
- **n** `number` — The number of items to skip.

## Returns

`Generator` — A new generator with the remaining items.

## Example

```js
const it = dropIter([1, 2, 3], 1);
[...it] //=> [2, 3]
```
