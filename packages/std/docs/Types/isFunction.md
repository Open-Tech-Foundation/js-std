# isFunction

Checks if the given value is a function.

## Syntax

```ts
import { isFunction } from '@opentf/std';

isFunction( val: unknown, ): val is (...args: unknown[]) => unknown
```

## Example

```js
isFunction(() => {}) //=> true

isFunction(1) //=> false
```
