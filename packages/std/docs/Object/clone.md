# clone

It deeply clones the given value

### Example

```js
const obj1 = {a: 1, b: ['x']}
const obj2 = clone(obj1)
obj1 === obj2 //=> false
obj1.b === obj2.b //=> false
```
