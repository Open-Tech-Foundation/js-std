# shuffle

Randomizes the order of the elements in a given array.

Uses a Fisher-Yates shuffle drawing from the same crypto-backed source as
`sample`, rather than `Math.random`. `Math.random` is a seeded generator
whose output can be predicted from earlier draws, which is the wrong tool
the moment an order carries any weight — assigning treatments, picking a
winner, ordering anything an adversary would rather guess.

## Parameters

- **arr** `T[]` — The source array.

## Returns

`T[]` — A new shuffled array.

## Example

```js
shuffle([1, 2, 3]) //=> [2, 3, 1]
```
