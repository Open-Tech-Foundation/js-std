# idleRun

> ⏱️ Creates a debounced function that delays invoking `func` until after `delay` milliseconds have elapsed since the last time the debounced function was invoked.

## Syntax

```ts
import { idleRun } from '@opentf/std';

idleRun<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 0,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};
```

## Parameters

- `func`: The function to debounce.
- `delay`: The number of milliseconds to delay. Default: `0`.
- `options`:
    - `leading`: Specify invoking on the leading edge of the timeout. Default: `false`.
    - `trailing`: Specify invoking on the trailing edge of the timeout. Default: `true`.
    - `maxWait`: The maximum time `func` is allowed to be delayed before it's invoked.

## Returns

The new debounced function.

## Examples

```ts
const run = idleRun((val) => console.log(val), 500);

run('a');
run('b');
run('c');
// => logs 'c' after 500ms
```
