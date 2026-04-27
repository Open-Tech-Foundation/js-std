# hexEncode

Encodes a string to Hex format.

## Syntax

```ts
import { hexEncode } from '@opentf/std';

hexEncode(str: string): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The string to encode. |

## Returns

`string`: The Hex encoded string.

## Example

```js
hexEncode('Hello') //=> '48656c6c6f'
```
