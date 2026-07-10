# pick

Includes all the property paths from the given object for the given list of paths.

When the source object uses `Object.create(null)`, the returned picked object
preserves that null prototype, including nested picked containers.

### Example

```js

pick({a: 1, b: 2}, 'a') //=> {a: 1}
```
