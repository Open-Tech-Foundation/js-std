# gcd

Calculates the greatest common divisor of two integers.

## Syntax

```ts
import { gcd } from '@opentf/std';

gcd(a: number, b: number): number
```

## Parameters

| Name | Type     | Description          |
| ---- | -------- | -------------------- |
| a    | `number` | The first integer.   |
| b    | `number` | The second integer.  |

## Returns

`number`: The greatest common divisor.

## Example

```js
gcd(12, 8) //=> 4
gcd(54, 24) //=> 6
```
