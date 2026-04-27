# isPlainObject

Checks if the given value is a plain object (i.e., created via `{}` or `Object.create(null)`).

## Syntax

```ts
import { isPlainObject } from '@opentf/std';

isPlainObject( val: unknown, ): val is Record<string, unknown>
```

## Example

```js
isPlainObject({}) //=> true

isPlainObject([]) //=> false

isPlainObject(Object.create(null)) //=> true

isPlainObject(new Map()) //=> false

isPlainObject(null) //=> false
```
