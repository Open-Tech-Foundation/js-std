# limitRun

Creates a gate that runs at most `concurrency` tasks at a time.

`mapAsync` and the rest of the concurrency module already take a limit, but
only over one array being processed by one callback. Anything else — a
connection pool shared by several different queries, an API budget spent by
unrelated parts of a program, work arriving over time rather than as a list —
had no way to be limited at all.

Unlike the rest of this module, this wraps no particular function: it takes a
limit and gives back a gate that any task can be passed through. That is the
shape the shared-budget case needs, since the whole point is that unrelated
operations draw on one limit. Wrapping a single function is a line on top:
`const load = (id) => limit(() => fetchUser(id))`.

Tasks start in the order they were submitted. A task submitted while a slot
is free starts immediately, within the same tick, rather than after a turn of
the event loop.

A task that throws releases its slot and rejects its own promise only — the
gate keeps running and the other tasks are unaffected. Each caller must
handle its own rejection, exactly as if it had called the task directly.

This limits how many run **at once**, not how often they start. Use
`rateLimitRun` for a budget over time, such as sixty calls a minute.

## Parameters

- **concurrency** `number` _(default: `1`)_ — The most tasks that may run at once.

## Returns

`LimitRunFn` — The gate.

## Throws

- `RangeError` — If `concurrency` is not a positive integer.

## Examples

```js
const limit = limitRun(2);
const pages = await Promise.all(urls.map((url) => limit(() => fetch(url))));
```

```js
// One budget shared by unrelated operations
const db = limitRun(5);
await Promise.all([
  db(() => query('SELECT 1')),
  db(() => insert(row)),
]);
```

```js
limit.active //=> 2
limit.pending //=> 7
```
