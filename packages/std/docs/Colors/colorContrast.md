# colorContrast

Calculates the contrast ratio between two colors.

## Syntax

```ts
import { colorContrast } from '@opentf/std';

colorContrast(color1: any, color2: any): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| color1 | `any` | The first color. |
| color2 | `any` | The second color. |

## Returns

`number`: The contrast ratio (1 to 21).

## Example

```js
colorContrast('#fff', '#000') //=> 21
```
