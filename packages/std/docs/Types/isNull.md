# isNull

Checks if the given value is null.

## Syntax

```ts
import { isNull } from '@opentf/std';

isNull(val: unknown): val is null
```

## Example

```js
isNull(null) //=> true

isNull(undefined) //=> false
```
