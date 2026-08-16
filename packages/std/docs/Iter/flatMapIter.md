# flatMapIter

Maps each item in an iterator and flattens the result.

## Parameters

- **iter** `Iterable<T>` — The iterable to transform.
- **fn** `(val: T) => Iterable<U>` — The mapper function returning iterables.

## Returns

`IterableIterator<U>` — A new iterable iterator.

## Example

```js
const flattened = flatMapIter([1, 2], x => [x, x * 10]);
[...flattened] //=> [1, 10, 2, 20]
```
