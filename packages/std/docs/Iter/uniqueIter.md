# uniqueIter

Returns a Generator that yields each item the first time it is seen.

Items come through as they are read, so an early duplicate-free prefix is
available before the source ends — but the keys seen so far are held, and that
set only grows. On an unbounded source of distinct values it grows without
limit, as any deduplication must.

Primitive keys are matched by identity, so `NaN` equals `NaN` and `-0` equals
`0`. Object keys are compared structurally with `isEql`, matching `unique`, and
against every distinct object seen so far — quadratic in the number of them, so
prefer a `by` that returns a primitive when the source is long.

@param {Iterable<T>} iterable The source iterable.
@param {Function} [by] The iteratee invoked per item to derive its key.
@returns {Generator<T>} A new generator without duplicates.

### Example

```js
const it = uniqueIter([1, 2, 2, 3, 1]);
[...it] //=> [1, 2, 3]

const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
[...uniqueIter(users, (u) => u.id)] //=> [{ id: 1 }, { id: 2 }]
```
