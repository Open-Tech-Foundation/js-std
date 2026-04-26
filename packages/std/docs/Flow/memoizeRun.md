# memoizeRun

> 🧠 Caches the results of an asynchronous function. Supports Single Flight (concurrent request de-duplication) and TTL.

## Syntax

```ts
import { memoizeRun } from '@opentf/std';

memoizeRun<T, Args extends any[]>(
  func: (...args: Args) => Promise<T>,
  options?: {
    maxAge?: number;
    key?: (...args: Args) => string;
  }
): {
  (...args: Args): Promise<T>;
  clear: () => void;
};
```

## Parameters

- `func`: The asynchronous function to memoize.
- `options`:
    - `maxAge`: The maximum time in milliseconds to keep the cached result.
    - `key`: An optional function to generate a cache key from the arguments. Defaults to `JSON.stringify(args)`.

## Returns

The memoized asynchronous function with a `.clear()` method.

## Examples

```ts
const memoized = memoizeRun(fetchUser, { maxAge: 5000 });

// Only one API call will be made if these are called concurrently
const [u1, u2] = await Promise.all([memoized(1), memoized(1)]);
```
