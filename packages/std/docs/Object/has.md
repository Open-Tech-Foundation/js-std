# has

Checks if the given path exists in the given object.

## Syntax

```ts
import { has } from '@opentf/std';

has(obj: object, path: string | unknown[]): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| obj | `Object` | The object to query. |
| path | `string|Array` | The path of the property to check. |

## Returns

`boolean`: True if the path exists, false otherwise.

## Example

```js
has({a: 1}, 'a') //=> true
has({a: {b: 2}}, ['a', 'b']) //=> true
```
