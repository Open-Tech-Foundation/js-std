# isBigInt

Checks if the given value is a BigInt.

## Syntax

```ts
import { isBigInt } from '@opentf/std';

isBigInt(val: unknown): val is bigint
```

## Example

```js
isBigInt(1) //=> false

isBigInt(1n) //=> true
```
