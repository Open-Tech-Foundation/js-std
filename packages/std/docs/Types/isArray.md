# isArray

Checks if the given value is an array.

## Syntax

```ts
import { isArray } from '@opentf/std';

isArray(val: unknown): val is Array<unknown>
```

## Example

```js
isArray([]) //=> true

isArray(new Array('a', 'b', 'c')) //=> true

isArray('abc') //=> false
```
