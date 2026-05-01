# hmacSHA512

Computes an HMAC-SHA-512 digest of a message with the given key.

## Syntax

```ts
import { hmacSHA512 } from '@opentf/std';

hmacSHA512(key: string, message: string): Promise<string>
```

## Parameters

| Name    | Type     | Description                |
| ------- | -------- | -------------------------- |
| key     | `string` | The secret key.            |
| message | `string` | The message to authenticate. |

## Returns

`Promise<string>`: The hex-encoded HMAC-SHA-512 digest.

## Example

```js
await hmacSHA512('secret', 'hello')
//=> 'db1595ae88a62fd151ec1cba81b98c39df82daae7b4cb9820f446d5bf02f1dcfca6683d88cab3e273f5963ab8ec469a746b5b19086371239f67d1e5f99a79440'
```
