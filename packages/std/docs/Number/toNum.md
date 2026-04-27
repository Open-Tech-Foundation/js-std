# toNum

Converts the given value into a finite number.

## Syntax

```ts
import { toNum } from '@opentf/std';

toNum(val: unknown): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| val | `unknown` | The value to convert. |

## Returns

`number`: The converted number or NaN.

## Example

```js
toNum('1.5') //=> 1.5
toNum('1_000') //=> 1000
```
