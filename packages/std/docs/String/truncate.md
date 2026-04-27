# truncate

Truncates string if it's longer than the given maximum string length.

## Syntax

```ts
import { truncate } from '@opentf/std';

truncate( str: string, length = 30, omission = '...', ): string
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| str | `string` | The string to truncate. |

## Returns

`string`: The truncated string.

## Example

```js
truncate('hi-package', 8) //=> 'hi-pa...'
```
