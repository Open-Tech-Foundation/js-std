# toArrayIter

Collects all items from an iterator into an array.

## Parameters

- **iter** `Iterable<T>` — The iterable to collect.

## Returns

`T[]` — An array of all items.

## Example

```js
toArrayIter((function*() { yield 1; yield 2; })()) //=> [1, 2]
```
