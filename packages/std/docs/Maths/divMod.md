# divMod

Returns a tuple containing the quotient and the remainder.

## Syntax

```ts
import { divMod } from '@opentf/std';

divMod(a: number, b: number): [number, number]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| a | `number` | The dividend. |
| b | `number` | The divisor. |

## Returns

`[number, number]`: A tuple containing [quotient, remainder].

## Example

```js
divMod(4, 2) //=> [2, 0]
divMod(11, 4) //=> [2.75, 3]
```
