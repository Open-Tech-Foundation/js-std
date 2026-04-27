# isAsyncFunction

Checks if the given value is an async function.

## Syntax

```ts
import { isAsyncFunction } from '@opentf/std';

isAsyncFunction( val: unknown, ): val is ((...args: unknown[]) => Promise<unknown>) | AsyncGeneratorFunction
```

## Example

```js
isAsyncFunction(async () => {}) //=> true

isAsyncFunction(() => {}) //=> false
```
