# isNumber

Checks if the given value is a finite number.

## Syntax

```ts
import { isNumber } from '@opentf/std';

isNumber(val: unknown, coerce = false): val is number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| val | `unknown` | The value to check. |

## Returns

`boolean`: True if the value is a number, false otherwise.

## Example

```js
isNumber(1) //=> true
isNumber('1', true) //=> true
```
