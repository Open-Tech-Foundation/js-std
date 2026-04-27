# isNegZero

Checks if the given number is negative zero (-0).

## Syntax

```ts
import { isNegZero } from '@opentf/std';

isNegZero(n: number): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| n | `number` | The number to check. |

## Returns

`boolean`: True if -0, false otherwise.

## Example

```js
isNegZero(-0) //=> true
isNegZero(0) //=> false
```
