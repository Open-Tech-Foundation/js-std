# memoizeRun

Caches the results of an asynchronous function.
Supports Single Flight (concurrent request de-duplication) and TTL.

### Example

```js
const memoized = memoizeRun(fetchUser, { maxAge: 5000 });
```
