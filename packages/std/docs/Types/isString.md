# isString

Checks if the given value is a string.

## Syntax

```ts
import { isString } from '@opentf/std';

isString(val: unknown): val is string
```

## Example

```js
isString('abc') //=> true

isString(String(1)) //=> true

isString(1) //=> false
```
