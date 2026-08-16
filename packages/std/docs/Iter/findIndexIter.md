# findIndexIter

Finds the index of the first item in an iterator that matches a predicate.

## Parameters

- **iter** `Iterable<T>` — The iterable to search.
- **fn** `(val: T) => boolean` — The predicate function.

## Returns

`number` — The index of the first matching item, or -1.

## Example

```js
findIndexIter([1, 2, 3], x => x === 2) //=> 1
```
