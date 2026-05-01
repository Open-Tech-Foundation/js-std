# eachIterAsync

Executes a function for each item in an async iterator.

## Syntax

```ts
import { eachIterAsync } from '@opentf/std';

eachIterAsync<T>(iter: AsyncIterable<T>, fn: (val: T) => void | Promise<void>): Promise<void>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `AsyncIterable<T>` | The async iterable to iterate over. |
| fn | `Function` | The function to execute. |

## Example

```js
async function* gen() { yield 1; yield 2; }
await eachIterAsync(gen(), x => console.log(x)) //=> Logs 1, 2
```
