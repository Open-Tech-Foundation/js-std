# isDate

Checks if the given value is a valid date object.

## Syntax

```ts
import { isDate } from '@opentf/std';

isDate(val: unknown): val is Date
```

## Example

```js
isDate(new Date()) //=> true

isDate(new Date('')) //=> false

isDate('2000-01-01') //=> false
```
