# pipe

Performs left-to-right function composition.

## Syntax

```ts
import { pipe } from '@opentf/std';

pipe( ...fns: ((...args: any[]) => any)[] ): (...args: any[]) => any
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| fns | `Function[]` | The functions to pipe. |

## Returns

`Function`: A new function that pipes its arguments.

## Example

```js
const addAbs = pipe((a, b) => a + b, Math.abs);
addAbs(-2, -3) //=> 5
```
