# toUnset

Removes the property of the given object at the given path & returns new object.

`__proto__`, `constructor` and `prototype` are refused as path segments.
The path is checked before anything is written, so a path that will be
refused leaves the object exactly as it was — no partial branch.

## Example

```js
toUnset({a: 1, b: 2}, 'a') //=> {b: 2}
```
