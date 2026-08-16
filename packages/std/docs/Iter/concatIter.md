# concatIter

Returns a Generator that yields the items of each iterable in turn.

Each source is only started once the one before it is exhausted, so a
consumer that stops early never touches the later ones.

## Parameters

- **iterables** `...Iterable<T>` — The iterables to concatenate.

## Returns

`Generator<T>` — A new generator over all of them, in order.

## Examples

```js
const it = concatIter([1, 2], [3, 4]);
[...it] //=> [1, 2, 3, 4]
```

```js
[...concatIter('ab', [1, 2])] //=> ['a', 'b', 1, 2]
```
