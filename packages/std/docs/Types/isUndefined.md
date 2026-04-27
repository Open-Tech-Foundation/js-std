# isUndefined

Checks if the given value is undefined.

## Syntax

```ts
import { isUndefined } from '@opentf/std';

isUndefined(val: unknown): val is undefined
```

## Example

```js
isUndefined() //=> true

isUndefined(undefined) //=> true

isUndefined(null) //=> false
```
