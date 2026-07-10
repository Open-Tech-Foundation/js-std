# memoizeRun

Caches the results of an asynchronous function.
Supports Single Flight (concurrent request de-duplication) and TTL.

By default, cache keys are derived structurally for common built-in value types,
including plain objects, arrays, `BigInt`, `Date`, `Map`, `Set`, typed arrays,
array buffers, data views, regular expressions, errors, and cyclic structures.

Functions and unsupported object instances are keyed by reference identity.
Provide a custom `key` function when you need domain-specific cache semantics,
canonicalization rules, or a simpler keying strategy.

### Example

```js
const memoized = memoizeRun(fetchUser, { maxAge: 5000 });
```
