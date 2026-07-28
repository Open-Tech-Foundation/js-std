# sleep

Suspends execution for the given number of milliseconds.

Passing a signal makes the sleep cancellable: aborting rejects the promise with the signal's reason and clears the pending timer, so a cancelled sleep does not hold the event loop open waiting to resolve something nobody is listening for.

@param ms - The number of milliseconds to sleep, `0` by default.
@param options - An optional abort signal.
@returns A promise that resolves after the given time.
@throws Rejects with `signal.reason` if the signal is aborted.

### Example

```js
await sleep(1000)

const controller = new AbortController();
setTimeout(() => controller.abort(), 100);
await sleep(5000, { signal: controller.signal }); // rejects after 100ms
```
