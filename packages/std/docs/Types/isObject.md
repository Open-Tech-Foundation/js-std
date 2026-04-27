# isObject

Checks if the given value is an object and not null.

## Syntax

```ts
import { isObject } from '@opentf/std';

isObject(val: unknown): val is object
```

## Example

```js
isObject({}) //=> true

isObject([]) //=> true

isObject(null) //=> false
```
