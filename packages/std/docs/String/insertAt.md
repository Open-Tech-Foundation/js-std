# insertAt

Inserts a string at a specific index.

## Syntax

```ts
import { insertAt } from '@opentf/std';

insertAt(str: string, index = 0, insertStr = ''): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The source string. |

## Returns

`string`: The modified string.

## Example

```js
insertAt('ac', 1, 'b') //=> 'abc'
```
