# isNil

Checks if the given value is null or undefined.

## Syntax

```ts
import { isNil } from '@opentf/std';

isNil(val: unknown): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| val | `unknown` | The value to check. |

## Returns

`boolean`: True if null or undefined, false otherwise.

## Example

```js
isNil(null) //=> true
isNil(undefined) //=> true
isNil(1) //=> false
```
