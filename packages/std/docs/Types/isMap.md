# isMap

Checks if the given value is a Map object.

## Syntax

```ts
import { isMap } from '@opentf/std';

isMap(val: unknown): val is Map<unknown, unknown>
```

## Example

```js
isMap(new Map()) //=> true

isMap(new WeakMap()) //=> false

isMap({}) //=> false
```
