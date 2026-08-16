# eachIter

Executes a function for each item in an iterator.

## Parameters

- **iter** `Iterable<T>` — The iterable to iterate over.
- **fn** `(val: T) => void` — The function to execute.

## Example

```js
eachIter([1, 2, 3], x => console.log(x)) //=> Logs 1, 2, 3
```
