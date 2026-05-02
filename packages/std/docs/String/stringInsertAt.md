# stringInsertAt

Inserts a string at a specific index.

## Syntax

```ts
import { stringInsertAt } from '@opentf/std';

stringInsertAt(str: string, index = 0, insertStr = ''): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The source string. |

## Returns

`string`: The modified string.

## Example

```js
stringInsertAt('ac', 1, 'b') //=> 'abc'
```
