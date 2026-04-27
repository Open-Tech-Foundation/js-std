# isInfinity

Checks if the given value is Infinity.

## Syntax

```ts
import { isInfinity } from '@opentf/std';

isInfinity(x: unknown): x is typeof Infinity
```

## Example

```js
isInfinity(0) //=> false

isInfinity(NaN) //=> false

isInfinity(Infinity) //=> true
```
