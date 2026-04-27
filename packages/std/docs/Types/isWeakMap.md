# isWeakMap

Checks if the given value is a WeakMap object.

## Syntax

```ts
import { isWeakMap } from '@opentf/std';

isWeakMap( val: unknown, ): val is WeakMap<WeakKey, unknown>
```

## Example

```js
isWeakMap(new Map()) //=> false

isWeakMap(new WeakMap()) //=> true
```
