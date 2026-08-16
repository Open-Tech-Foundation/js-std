# uniqueIterAsync

Returns an AsyncGenerator that yields each item the first time it is seen.

Items come through as they are read, so an early duplicate-free prefix is
available before the stream ends — but the keys seen so far are held, and
that set only grows. On an endless stream of distinct values it grows
without limit, as any deduplication must.

Primitive keys are matched by identity, so `NaN` equals `NaN` and `-0`
equals `0`. Object keys are compared structurally with `isEql`, matching
`unique`, and against every distinct object seen so far — quadratic in the
number of them, so prefer a `by` that returns a primitive.

## Parameters

- **iterable** `AsyncIterable<T>` — The source async iterable.
- **by** `Function` _(optional)_ — The iteratee invoked per item to derive its key.

## Returns

`AsyncGenerator<T>` — A new async generator without duplicates.

## Example

```js
const ids = uniqueIterAsync(events, (e) => e.userId);
await toArrayIterAsync(ids) //=> one event per user, in first-seen order
```
