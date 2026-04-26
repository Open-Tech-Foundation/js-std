# batchRun

> 📦 Creates a batched function that collects calls and processes them in groups.

## Syntax

```ts
import { batchRun } from '@opentf/std';

batchRun<T extends any[], R>(
  batchProcessor: (argsList: T[]) => Promise<R[]>,
  options?: {
    limit?: number;
    delay?: number;
  }
): (...args: T) => Promise<R>;
```

## Parameters

- `batchProcessor`: The function that processes the collected arguments in a batch.
- `options`:
    - `limit`: The maximum number of calls to collect before processing the batch. Default: `Infinity`.
    - `delay`: The time in milliseconds to wait before processing the batch. Default: `0`.

## Returns

A function that returns a Promise for the result of the specific call.

## Examples

```ts
const batchFetch = batchRun(async (batch) => {
  // batch is an array of arguments: [[1], [2], [3]]
  const ids = batch.map(args => args[0]);
  return await fetchUsers(ids);
}, { limit: 10, delay: 50 });

const user1 = batchFetch(1);
const user2 = batchFetch(2);
```
