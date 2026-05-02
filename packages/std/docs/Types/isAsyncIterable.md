# isAsyncIterable

Checks if the given value is an async iterable.

### Example

```js

isAsyncIterable((async function* () {})()) //=> true

isAsyncIterable([]) //=> false
```
