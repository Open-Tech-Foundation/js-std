# timeoutRun

Enforces a time limit on an asynchronous function.

## Parameters

- **func** `Function` — The async function to run.
- **ms** `number` — The timeout in milliseconds.
- **options** `Object` _(optional)_ — The timeout options.

## Returns

`Promise<T>` — A promise that resolves to the function result.

## Example

```js
const result = await timeoutRun(() => fetchLargeData(), 1000);
```
