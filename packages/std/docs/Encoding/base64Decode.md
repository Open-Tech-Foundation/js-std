# base64Decode

Decodes a Base64 string.

## Syntax

```ts
import { base64Decode } from '@opentf/std';

base64Decode(str: string): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The Base64 string to decode. |

## Returns

`string`: The decoded string.

## Example

```js
base64Decode('SGVsbG8=') //=> 'Hello'
```
