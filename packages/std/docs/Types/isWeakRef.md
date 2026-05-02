# isWeakRef

Checks if the given value is a WeakRef object.

### Example

```js

isWeakRef({}) //=> false

let user = { name: "John" };
isWeakRef(new WeakRef(user)) //=> true
```
