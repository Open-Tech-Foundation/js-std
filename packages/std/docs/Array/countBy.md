# countBy

Creates an object composed of keys generated from the results of running each element of collection through iteratee.

Keys of `__proto__`, `constructor` and `prototype` are refused and their
elements left uncounted, as writing one would reach the prototype of the
result.

## Parameters

- **arr** `T[]` — The source array.
- **by** `Function|string` — The iteratee to transform keys.

## Returns

`Record<string, number>` — The composed aggregate object.

## Example

```js
countBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': 1, '6': 2 }
```
