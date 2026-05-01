# lerp

Linearly interpolates between two values.

## Syntax

```ts
import { lerp } from '@opentf/std';

lerp(start: number, end: number, t: number): number
```

## Parameters

| Name  | Type     | Description                    |
| ----- | -------- | ------------------------------ |
| start | `number` | The starting value.            |
| end   | `number` | The ending value.              |
| t     | `number` | The interpolation factor (0-1).|

## Returns

`number`: The interpolated value.

## Example

```js
lerp(0, 10, 0.5) //=> 5
lerp(100, 200, 0.25) //=> 125
```
