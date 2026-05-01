# hmacSHA256

Computes an HMAC-SHA-256 digest of a message with the given key.

## Syntax

```ts
import { hmacSHA256 } from '@opentf/std';

hmacSHA256(key: string, message: string): Promise<string>
```

## Parameters

| Name    | Type     | Description                |
| ------- | -------- | -------------------------- |
| key     | `string` | The secret key.            |
| message | `string` | The message to authenticate. |

## Returns

`Promise<string>`: The hex-encoded HMAC-SHA-256 digest.

## Example

```js
await hmacSHA256('secret', 'hello')
//=> '88aab3ede8d3adf94d26ab90d3bafd4a2083070c3bcce9c014ee04a443847c0b'
```
