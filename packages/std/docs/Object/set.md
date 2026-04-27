# set

Sets the value to an object at the given path.

## Syntax

```ts
import { set } from '@opentf/std';

set<T>( obj: T, path: string | unknown[], value: unknown | ((val: unknown) => unknown), ): T
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| obj | `T` | The object to modify. |
| path | `string|Array` | The path of the property to set. |
| value | `unknown|Function` | The value to set or a function to produce it. |

## Returns

`T`: The modified object.

## Example

```js
set({}, 'a.b', 1) //=> {a: {b: 1} }
```
