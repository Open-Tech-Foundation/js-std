# isDisjointFrom

Returns a boolean  indicating if this set has no elements in common with the given set.

## Syntax

```ts
import { isDisjointFrom } from '@opentf/std';

isDisjointFrom( a: unknown[] | Set<unknown>, b: unknown[] | Set<unknown>, ): boolean
```

## Example

```js
const a = [1, 3, 5]
const b = [2, 4]
isDisjointFrom(a, b) //=> true
```
