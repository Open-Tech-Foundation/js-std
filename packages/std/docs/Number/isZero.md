# isZero

Checks if the given number is positive zero (0).

## Syntax

```ts
import { isZero } from '@opentf/std';

isZero(n: number): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| n | `number` | The number to check. |

## Returns

`boolean`: True if 0, false otherwise.

## Example

```js
isZero(0) //=> true
isZero(-0) //=> false
```
