# clamp

Returns a value clamped to the inclusive range of min and max.

## Syntax

```ts
import { clamp } from '@opentf/std';

clamp(val: number, min: number, max: number): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| val | `number` | The value to clamp. |
| min | `number` | The lower bound. |
| max | `number` | The upper bound. |

## Returns

`number`: The clamped value.

## Example

```js
clamp(10, -5, 5) //=> 5
clamp(0, 1000, 1366) //=> 1000
```
