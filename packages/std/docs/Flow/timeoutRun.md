# timeoutRun

Enforces a time limit on an asynchronous function.

## Syntax

```ts
import { timeoutRun } from '@opentf/std';

timeoutRun
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| func | `Function` | The async function to run. |
| ms | `number` | The timeout in milliseconds. |

## Returns

`Promise<T>`: A promise that resolves to the function result.

## Example

```js
const result = await timeoutRun(() => fetchLargeData(), 1000);
```
