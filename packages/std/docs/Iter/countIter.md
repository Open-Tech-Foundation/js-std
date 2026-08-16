# countIter

Returns the total count of items in an iterable.

## Parameters

- **iter** `Iterable<unknown>` — The iterable to count.

## Returns

`number` — The total count of items.

## Example

```js
countIter((function*() { yield 1; yield 2; })()) //=> 2
```
