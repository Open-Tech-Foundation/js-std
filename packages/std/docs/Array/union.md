# union

Returns unique values in all the given collections.

### Example

```js

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 3, 5]);
const setC = new Set([2, 5, 3]);
union(setA, setB, setC) //=> [1, 2, 3, 4, 5]
```
