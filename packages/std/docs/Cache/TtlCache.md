# TtlCache

A cache whose entries expire a fixed time after they are written.

Expiry is lazy: an entry is dropped when it is next looked at, and `size` and the iteration methods sweep before reporting so they never count something already stale. No timers are used, deliberately — a timer per entry would hold the event loop open and keep a process alive past its work.

A cache that is written to but never read will therefore hold expired entries until something touches it. Call `prune` if that matters.

@param ttl - How long an entry stays valid, in milliseconds.

### Example

```js
const cache = new TtlCache(1000);
cache.set('a', 1);
cache.get('a'); //=> 1
// ...over a second later
cache.get('a'); //=> undefined

// A per-entry lifetime overrides the default.
cache.set('short', 1, 50);
```
