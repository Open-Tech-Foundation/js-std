<!-- handwritten -->

# LruCache

A fixed-capacity cache that evicts the least recently used entry once it is full.

Recency is tracked by `Map` insertion order: reading or writing a key moves it to the end, so the oldest key is always the first one the map yields. That makes every operation O(1) with no auxiliary linked list.

`get` counts as a use; `peek` deliberately does not, so a cache can be inspected without disturbing what it is about to evict. `has` does not count either.

## Parameters

- **maxSize** — The number of entries to hold before evicting.

## Example

```js
const cache = new LruCache(2);
cache.set('a', 1);
cache.set('b', 2);
cache.get('a');    // 'a' is now the most recently used
cache.set('c', 3); // evicts 'b', not 'a'
cache.has('b');    //=> false
```
