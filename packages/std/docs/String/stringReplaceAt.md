# stringReplaceAt

Replaces characters in a string at a specific index.

## Syntax

```ts
import { stringReplaceAt } from '@opentf/std';

stringReplaceAt(str: string, index = 0, replaceStr = ''): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The source string. |

## Returns

`string`: The modified string.

## Example

```js
stringReplaceAt('abc', 1, 'z') //=> 'azc'
```
