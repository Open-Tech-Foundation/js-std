# memoizeRun

Caches the results of an asynchronous function.
Supports Single Flight (concurrent request de-duplication) and TTL.

## Syntax

```ts
import { memoizeRun } from '@opentf/std';

memoizeRun<T, Args extends any[]>( func: (...args: Args) => Promise<T>, options:
```

## Example

```js
const memoized = memoizeRun(fetchUser, { maxAge: 5000 });
```
