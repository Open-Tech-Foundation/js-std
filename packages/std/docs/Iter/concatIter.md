# concatIter

Returns a Generator that yields the items of each iterable in turn.

Each source is only started once the one before it is exhausted, so a consumer
that stops early never touches the later ones.

@param {...Iterable<T>} iterables The iterables to concatenate.
@returns {Generator<T>} A new generator over all of them, in order.

### Example

```js
const it = concatIter([1, 2], [3, 4]);
[...it] //=> [1, 2, 3, 4]

[...concatIter('ab', [1, 2])] //=> ['a', 'b', 1, 2]
```
