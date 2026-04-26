# memoizeRun

Caches asynchronous function results with Single Flight and TTL.

## Options

- `maxAge` (number): TTL in ms.
- `key` (function): Custom key generator.

## Examples

```ts
const fn = memoizeRun(async (id) => getData(id), { maxAge: 1000 });
await fn(1); // Call
await fn(1); // Cache
```

## Features

- **Single Flight**: Concurrent calls share the same promise.
- **Auto-Cleanup on Error**: If the function rejects, the cache entry is removed so the next call can retry.
- **Manual Clear**: `fn.clear()` to empty cache.
