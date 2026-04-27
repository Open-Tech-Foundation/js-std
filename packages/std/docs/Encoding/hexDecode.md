# hexDecode

Decodes a Hex string.

## Syntax

```ts
import { hexDecode } from '@opentf/std';

hexDecode(str: string): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The Hex string to decode. |

## Returns

`string`: The decoded string.

## Example

```js
hexDecode('48656c6c6f') //=> 'Hello'
```
