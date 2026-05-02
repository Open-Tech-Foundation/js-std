# eachIter

Executes a function for each item in an iterator.

@param {Iterable<T>} iter The iterable to iterate over.
@param {(val: T) => void} fn The function to execute.

### Example

```js
eachIter([1, 2, 3], x => console.log(x)) //=> Logs 1, 2, 3
```
