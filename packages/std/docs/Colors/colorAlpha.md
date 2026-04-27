# colorAlpha

Adjusts the alpha channel of a color.

## Syntax

```ts
import { colorAlpha } from '@opentf/std';

colorAlpha( input: any, amount: number, format: ColorFormat = 'hex', ): any
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| input | `any` | The input color. |
| amount | `number` | The alpha value (0 to 1). |

## Returns

`any`: The color with adjusted alpha.

## Example

```js
colorAlpha('red', 0.5, 'rgba') //=> 'rgba(255, 0, 0, 0.5)'
```
