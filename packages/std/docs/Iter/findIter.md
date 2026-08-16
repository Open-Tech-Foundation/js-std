# findIter

Finds the first item in an iterator that matches a predicate.

## Parameters

- **iter** `Iterable<T>` — The iterable to search.
- **fn** `(val: T) => boolean` — The predicate function.

## Returns

`T | undefined` — The first matching item, or undefined.

## Example

```js
findIter([1, 2, 3], x => x > 1) //=> 2
```
