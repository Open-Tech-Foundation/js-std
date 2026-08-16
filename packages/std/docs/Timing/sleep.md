# sleep

Suspends execution for the given number of milliseconds.

Passing a signal makes the sleep cancellable: aborting rejects the promise
with the signal's reason and clears the pending timer, so a cancelled sleep
does not hold the event loop open waiting to resolve something nobody is
listening for.

## Parameters

- **ms** `number` _(default: `0`)_ — The number of milliseconds to sleep.
- **options** `{ signal?: AbortSignal }` _(optional)_ — An optional abort signal.

## Returns

`Promise<void>` — A promise that resolves after the given time.

## Throws

- Rejects with `signal.reason` if the signal is aborted.

## Examples

```js
await sleep(1000)
```

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 100);
await sleep(5000, { signal: controller.signal }); // rejects after 100ms
```
