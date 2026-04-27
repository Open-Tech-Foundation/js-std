# isRegExp

Checks if the given value is a RegExp object.

## Syntax

```ts
import { isRegExp } from '@opentf/std';

isRegExp(val: unknown): val is RegExp
```

## Example

```js
isRegExp(new RegExp()) //=> true

isRegExp(/a/) //=> true

isRegExp({}) //=> false
```
