<!-- handwritten -->

# retryRun

Retries an asynchronous function according to the specified options.

`retries` must be a non-negative integer no greater than `MAX_RETRIES` (1000),
`delay` must be a non-negative finite number, `backoff` must be either
`'fixed'` or `'exponential'`, and `jitter` must be a finite number from `0`
(no jitter) to `1`.

`onRetry` receives the error as `unknown`, because a rejection can carry any
value, not just an `Error`. It fires only when another attempt will actually
run — not on the final failure, and not when `shouldRetry` refuses the retry.

## Parameters

- **func** `Function` — The async function to retry.
- **options** `RetryRunOptions` _(optional)_ — The retry options.

## Returns

`Promise<T>` — A promise that resolves to the function result.

### Options

- `retries`: How many times to retry after the first attempt fails. Defaults to `3`.
- `delay`: The delay between attempts, in milliseconds. Defaults to `0`.
- `backoff`: Whether `delay` stays constant or doubles each attempt. Defaults to `'fixed'`.
- `onRetry`: Called before each retry with the error that caused it and the one-based attempt number.
- `jitter`: Randomizes each wait by up to this fraction of the computed delay, from `0` to `1`. Defaults to `0`. Without it, clients that failed together retry at the same moment and fail together again: with `jitter: 0.2`, a 1000ms wait becomes a uniform random wait in `[800, 1200]`. A zero delay stays zero.
- `signal`: Aborting this signal stops retrying and rejects with `signal.reason` — including mid-wait, where the pending timer is cleared. Close over the same signal inside `func` where the work itself must actually stop, since a promise has no cancel.
- `shouldRetry`: Decides whether a failure is worth retrying. Receives the error and the one-based failed-attempt number, and may be async. Return `false` to stop immediately and throw — for example, retry a `503` but not a `400`. Defaults to retrying every error.
- `respectRetryAfter`: When `true`, a `Retry-After` value carried by the error raises a shorter computed wait to the server's value (the longer of the two wins). Accepts seconds (`"120"`), HTTP dates, a `retryAfter` property in seconds, a `retryAfterMs` property in milliseconds, or the same value under a `response` property (axios-style) or `headers` (a `Headers` instance, `Map`, entries array, or plain object, matched case-insensitively). Unparseable values are ignored. Defaults to `false`.

## Throws

- Rejects with `signal.reason` if the signal is aborted.
- Rejects with the last error once retries run out or `shouldRetry` returns `false`.

## Example

```js
const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
```

```js
// Retry a 503 but not a 400, spreading retries so clients don't move together
await retryRun(() => fetch('/api'), {
  retries: 5,
  delay: 1000,
  backoff: 'exponential',
  jitter: 0.2,
  shouldRetry: (error) => error.status !== 400,
});

// Stop retrying when the caller gives up, and honor the server's back-off
const controller = new AbortController();
await retryRun(() => fetch('/api'), {
  retries: 5,
  delay: 1000,
  signal: controller.signal,
  respectRetryAfter: true,
});
```
