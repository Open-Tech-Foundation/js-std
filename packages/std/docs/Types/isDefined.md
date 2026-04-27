# isDefined

Checks if the given value is defined.

## Syntax

```ts
import { isDefined } from '@opentf/std';

isDefined(val: unknown): boolean
```

## Example

```js
isDefined() //=> false
isDefined(undefined) //=> false
isDefined(null) //=> true
isDefined('') //=> true
```
