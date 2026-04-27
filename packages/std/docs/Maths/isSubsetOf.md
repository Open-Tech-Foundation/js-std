# isSubsetOf

Returns a boolean indicating if all elements of this set are in the given set.

## Syntax

```ts
import { isSubsetOf } from '@opentf/std';

isSubsetOf( a: unknown[] | Set<unknown>, b: unknown[] | Set<unknown>, proper = false, ): boolean
```

## Example

```js
const a = [1, 2, 3, 4]
const b = [2, 4]
isSubsetOf(b, a) //=> true
```
