# replaceAt

Replaces characters in a string at a specific index.

## Syntax

```ts
import { replaceAt } from '@opentf/std';

replaceAt(str: string, index = 0, replaceStr = ''): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The source string. |

## Returns

`string`: The modified string.

## Example

```js
replaceAt('abc', 1, 'z') //=> 'azc'
```
