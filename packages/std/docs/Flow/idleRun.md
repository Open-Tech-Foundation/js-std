# idleRun

Creates a debounced function that delays invoking `func` until after `delay` milliseconds
have elapsed since the last time the debounced function was invoked.

## Syntax

```ts
import { idleRun } from '@opentf/std';

idleRun<T extends (...args: any[]) => any>( func: T, delay = 0, options:
```

## Example

```js
const run = idleRun((val) => console.log(val), 500);
run('a');
run('b');
// => logs 'b' after 500ms
```
