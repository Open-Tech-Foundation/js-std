<!-- handwritten -->

# pollRun

Runs an asynchronous function repeatedly until its result satisfies a condition,
then resolves with that result.

This is waiting for something to become true: a job to leave `'pending'`, a
container to report healthy, a file to appear, a deployment to go live. The
shape is always the same — ask, check, wait, ask again — and writing it by hand
means writing the timeout and the give-up path by hand each time.

It is the opposite of `retryRun`, which repeats on **failure**. Here a
successful call whose result is not yet what was wanted is the reason to go
round again, and an error is not: a poll that throws rejects immediately rather
than being swallowed, since a failing call is a real failure and not a `false`
in disguise. Compose the two — `pollRun(() => retryRun(check), …)` — where a
call may fail transiently and still be worth polling.

The first attempt runs immediately, so a condition that already holds costs one
call and no waiting.

`timeout` bounds the whole operation, not one attempt, and holds even while `fn`
itself is running — a slow call cannot overrun it. As with any timeout on a
promise, the call in flight is not cancelled, because a promise has no cancel;
polling simply stops. Pass `signal` through to the work itself where it must
actually stop.

## Parameters

- **fn** `Function` — The function to poll. May be sync or async.
- **options** `PollRunOptions<T>` — The polling options. `until` is required.

## Returns

`Promise<T>` — The first result that satisfied `until`.

### Options

- `until`: Decides whether polling is done. Receives the value and the one-based attempt number. May be async.
- `interval`: How long to wait between attempts, in milliseconds. Defaults to `100`.
- `backoff`: Whether `interval` stays constant or doubles each attempt. Defaults to `'fixed'`.
- `attempts`: The most attempts to make. Defaults to `Infinity`.
- `timeout`: The longest to keep polling, in milliseconds. Defaults to `Infinity`.
- `signal`: Aborting this signal rejects the poll and stops the pending wait.

## Throws

- `Error` — If the attempts or the timeout run out first.

## Example

```js
const job = await pollRun(() => getJob(id), {
  until: (job) => job.status !== 'pending',
  interval: 1000,
  timeout: 30_000,
});

// Backing off rather than asking at a fixed rate
await pollRun(() => ping(), {
  until: (ok) => ok,
  interval: 100,
  backoff: 'exponential',
  attempts: 8,
});
```
