# isWeakRef

Checks if the given value is a WeakRef object.

## Syntax

```ts
import { isWeakRef } from '@opentf/std';

isWeakRef(val: unknown): val is WeakRef<WeakKey>
```

## Example

```js
isWeakRef({}) //=> false

let user = { name: "John" };
isWeakRef(new WeakRef(user)) //=> true
```
