# mergeAll

Deeply merges all the given objects or arrays.

String-keyed and symbol-keyed object properties are both merged. Arrays at the
same key are concatenated.

### Example

```js

mergeAll([{a: 1}, {b: 2}]) //=> {a: 1, b: 2}

mergeAll([[1], [2]]) //=> [1, 2]
```
