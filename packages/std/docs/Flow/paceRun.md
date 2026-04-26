# paceRun

> ⏱️ Creates a throttled function that only invokes `func` at most once per every `interval` milliseconds.

## Syntax

```ts
import { paceRun } from '@opentf/std';

paceRun<T extends (...args: any[]) => any>(
  func: T,
  interval: number = 0,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};
```

## Parameters

- `func`: The function to throttle.
- `interval`: The number of milliseconds to throttle invocations to. Default: `0`.
- `options`:
    - `leading`: Specify invoking on the leading edge of the timeout. Default: `true`.
    - `trailing`: Specify invoking on the trailing edge of the timeout. Default: `true`.

## Returns

The new throttled function.

## Examples

```ts
const run = paceRun((val) => console.log(val), 500);

run('a'); // Logs 'a' immediately
run('b'); // Ignored (if trailing is false) or queued
```
