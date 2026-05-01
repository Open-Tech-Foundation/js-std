# someIter

Checks if any item in an iterator matches a predicate.

## Syntax

```ts
import { someIter } from '@opentf/std';

someIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to check. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`boolean`: True if any item matches, else false.

## Example

```js
someIter([1, 2, 3], x => x > 1) //=> true
```
