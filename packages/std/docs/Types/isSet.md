# isSet

Checks if the given value is a Set object.

## Syntax

```ts
import { isSet } from '@opentf/std';

isSet(val: unknown): val is Set<unknown>
```

## Example

```js
isSet(new Set()) //=> true

isSet(new WeakSet()) //=> false

isSet({}) //=> false
```
