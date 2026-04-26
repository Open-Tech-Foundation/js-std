# rateLimitRun

> 🚦 Creates a rate-limited function that ensures it only runs a specific number of times within a rolling time window.

## Syntax

```ts
import { rateLimitRun } from '@opentf/std';

rateLimitRun<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  period: number
): (...args: Parameters<T>) => Promise<ReturnType<T>>;
```

## Parameters

- `func`: The function to rate limit.
- `limit`: The maximum number of calls allowed in the period.
- `period`: The time window in milliseconds.

## Returns

A new rate-limited function that returns a Promise.

## Examples

```ts
const run = rateLimitRun(async (val) => val, 2, 1000); // 2 per second

run('a'); // runs immediately
run('b'); // runs immediately
run('c'); // waits until 1s after 'a' started
```
