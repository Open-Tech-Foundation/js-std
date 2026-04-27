# isWeakSet

Checks if the given value is a WeakSet object.

## Syntax

```ts
import { isWeakSet } from '@opentf/std';

isWeakSet(val: unknown): val is WeakSet<WeakKey>
```

## Example

```js
isWeakSet(new Set()) //=> false

isWeakSet(new WeakSet()) //=> true
```
