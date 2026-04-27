# isSupersetOf

Returns a boolean indicating if all elements of the given set are in this set.

## Syntax

```ts
import { isSupersetOf } from '@opentf/std';

isSupersetOf( a: unknown[] | Set<unknown>, b: unknown[] | Set<unknown>, proper = false, ): boolean
```

## Example

```js
const a = [1, 2, 3, 4]
const b = [2, 4]
isSupersetOf(a, b) //=> true
```
