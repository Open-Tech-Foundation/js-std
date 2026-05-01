# round

Rounds a number to a specified number of decimal places without floating point precision drift.

## Syntax

```ts
import { round } from '@opentf/std';

round(n: number, decimals?: number): number
```

## Parameters

| Name     | Type     | Description                                |
| -------- | -------- | ------------------------------------------ |
| n        | `number` | The number to round.                       |
| decimals | `number` | The number of decimal places (default 0).  |

## Returns

`number`: The rounded number.

## Example

```js
round(1.005, 2) //=> 1.01
round(1.23456, 3) //=> 1.235
```
