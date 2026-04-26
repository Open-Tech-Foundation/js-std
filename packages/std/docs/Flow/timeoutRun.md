# timeoutRun

> ⏲️ Enforces a time limit on an asynchronous function.

## Syntax

```ts
import { timeoutRun } from '@opentf/std';

timeoutRun<T>(
  func: () => Promise<T>,
  ms: number,
  options?: {
    message?: string;
    fallback?: T;
  }
): Promise<T>;
```

## Parameters

- `func`: The asynchronous function to execute.
- `ms`: The time limit in milliseconds.
- `options`:
    - `message`: Custom error message if timed out.
    - `fallback`: A value to return if timed out, instead of rejecting with an error.

## Returns

A Promise that resolves with the function's result or the fallback value, or rejects if timed out.

## Examples

```ts
try {
  const result = await timeoutRun(() => fetchLargeData(), 1000);
} catch (err) {
  // Rejects if it takes longer than 1s
}

// With fallback
const data = await timeoutRun(() => fetch(), 500, { fallback: 'DEFAULT' });
```
