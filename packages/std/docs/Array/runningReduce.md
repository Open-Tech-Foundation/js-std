# runningReduce

Reduces an array, keeping every intermediate result rather than only the
last one.

Where `reduce` answers "what is the total", this answers "what was the total
after each step" — running balances, cumulative totals for a chart, prefix
sums. The output always has the same length as the input.

The initial value is required, so an empty array returns an empty array
rather than having to guess a seed.

## Parameters

- **arr** `T[]` — The source array.
- **cb** `Function` — The reducer, invoked per element.
- **initial** `A` — The value to start from.

## Returns

`A[]` — The accumulated value after each element.

## Examples

```js
runningReduce([1, 2, 3, 4], (acc, cur) => acc + cur, 0) //=> [1, 3, 6, 10]
```

```js
// A running balance.
runningReduce(transactions, (bal, t) => bal + t.amount, openingBalance)
```
