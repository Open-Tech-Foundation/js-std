# intersperse

Inserts a separator between the elements of its list argument.

## Syntax

```ts
import { intersperse } from '@opentf/std';

intersperse( list: string | unknown[], sep: ((index: number) => unknown) | unknown, ): string | unknown[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| list | `string|unknown[]` | The source list. |
| sep | `Function|unknown` | The separator to insert. |

## Returns

`string|unknown[]`: A new list with the separator inserted.

## Example

```js
intersperse([1, 2, 3], '*') //=> [1, '*', 2, '*', 3]
intersperse('Hello', '-') //=> "H-e-l-l-o"
```
