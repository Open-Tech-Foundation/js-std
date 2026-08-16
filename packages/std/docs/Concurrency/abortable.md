# abortable

Stops waiting on a promise once a signal aborts.

This settles the promise you get back — it does **not** cancel the underlying
work, because a promise has no cancel. The original operation keeps running
to completion; you simply stop awaiting its result. Pass the signal into the
operation itself (as `fetch` accepts one) when the work must actually stop.

A rejection arriving from the original promise after an abort is swallowed
rather than surfacing as an unhandled rejection, since nothing is listening
for it by then.

## Parameters

- **promise** `Promise<T>` — The promise to wait on.
- **signal** `AbortSignal` — The signal that stops the wait.

## Returns

`Promise<T>` — A promise settling with `promise`, or rejecting on abort.

## Throws

- Rejects with `signal.reason` if the signal is aborted first.

## Example

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 100);
await abortable(slowOperation(), controller.signal); // rejects after 100ms
```
