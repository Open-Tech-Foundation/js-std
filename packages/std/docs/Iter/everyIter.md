# everyIter

Checks if all items in an iterator match a predicate.

## Parameters

- **iter** `Iterable<T>` — The iterable to check.
- **fn** `(val: T) => boolean` — The predicate function.

## Returns

`boolean` — True if all items match, else false.

## Example

```js
everyIter([1, 2, 3], x => x > 0) //=> true
```
