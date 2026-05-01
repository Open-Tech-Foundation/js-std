# eachIter

Executes a function for each item in an iterator.

## Syntax

```ts
import { eachIter } from '@opentf/std';

eachIter<T>(iter: Iterable<T>, fn: (val: T) => void): void
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to iterate over. |
| fn | `Function` | The function to execute. |

## Example

```js
eachIter([1, 2, 3], x => console.log(x)) //=> Logs 1, 2, 3
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to iterate over. |
| fn | `(val: T) => void` | The function to execute. |

## Returns

`void`

## Example

```js
forEachIter([1, 2, 3], x => console.log(x)) //=> Logs 1, 2, 3
```
