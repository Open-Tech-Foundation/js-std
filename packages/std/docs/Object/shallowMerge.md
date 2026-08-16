# shallowMerge

Merges the given two objects or arrays.

Sources are copied with `safeAssign` rather than `Object.assign`, so an own
`__proto__` key cannot replace the result's prototype.

## Example

```js
shallowMerge({a: 1}, {b: 2}) //=> {a: 1, b: 2}

shallowMerge([1], [2]) //=> [1, 2]
```
