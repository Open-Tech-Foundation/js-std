# takeIter

Returns a Generator that yields the first n items from an Iterable.

Exactly `n` items are read from the source and no more, so a value the
result does not include is never produced — which matters when producing
one is expensive or has a side effect.

## Parameters

- **iterable** `Iterable` — The source iterable.
- **n** `number` — The number of items to take.

## Returns

`Generator` — A new generator with the first n items.

## Example

```js
const it = takeIter([1, 2, 3], 2);
[...it] //=> [1, 2]
```
