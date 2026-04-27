# get

Gets the value of an object at the given path.

## Syntax

```ts
import { get } from '@opentf/std';

get( obj: object, path: string | unknown[], defVal?: unknown, ): unknown
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| obj | `Object` | The object to query. |
| path | `string|Array` | The path of the property to get. |

## Returns

`unknown`: The resolved value.

## Example

```js
get({a: {b: {c: 1}}}, 'a.b.c') //=> 1
```
