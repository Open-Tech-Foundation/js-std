# quantile

Calculates the value below which the given fraction of the data falls.

`p` runs from `0` to `1`, so a 95th percentile is `quantile(values, 0.95)`.
`0` gives the minimum, `1` the maximum and `0.5` the median — the same value
`median` returns, by construction.

A quantile rarely lands on an observation, so the two either side of it are
interpolated linearly: with `n` values, position `(n - 1) * p` is taken and
the fraction between the neighbouring values applied. This is the default of
R's `quantile`, NumPy's `percentile` and Excel's `PERCENTILE.INC` — the
method usually meant by "the 95th percentile" — but it is one of nine in
common use, and a figure produced by another will differ on small samples.

## Parameters

- **arr** `T[]` — The source array.
- **p** `number` — The fraction, from 0 to 1.
- **cb** `Function` _(optional)_ — The iteratee invoked per element to pick the number.

## Returns

`number` — The quantile, or `NaN` if there are no values.

## Throws

- `RangeError` — If `p` is not a number from 0 to 1.

## Examples

```js
quantile([1, 2, 3, 4], 0.25) //=> 1.75
quantile([1, 2, 3, 4], 0.5) //=> 2.5
quantile([1, 2, 3, 4], 0.75) //=> 3.25
```

```js
// The p95 of a set of response times.
quantile(requests, 0.95, (r) => r.durationMs)
```
