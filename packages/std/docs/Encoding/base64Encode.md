# base64Encode

Encodes a string to Base64 format.

## Syntax

```ts
import { base64Encode } from '@opentf/std';

base64Encode(str: string): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The string to encode. |

## Returns

`string`: The Base64 encoded string.

## Example

```js
base64Encode('Hello') //=> 'SGVsbG8='
```
