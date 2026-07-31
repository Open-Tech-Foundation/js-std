import validateFlowNumber from './validateFlowNumber';

/** The gate returned by {@link limitRun}. */
export interface LimitRunFn {
  /** Runs `fn` once a slot is free, and resolves with its result. */
  <T>(fn: () => T | Promise<T>): Promise<T>;
  /** How many tasks are running right now. */
  readonly active: number;
  /** How many tasks are waiting for a slot. */
  readonly pending: number;
  /** The limit this gate was created with. */
  readonly concurrency: number;
}

/**
 * Creates a gate that runs at most `concurrency` tasks at a time.
 *
 * `mapAsync` and the rest of the concurrency module already take a limit, but
 * only over one array being processed by one callback. Anything else — a
 * connection pool shared by several different queries, an API budget spent by
 * unrelated parts of a program, work arriving over time rather than as a list —
 * had no way to be limited at all.
 *
 * Unlike the rest of this module, this wraps no particular function: it takes a
 * limit and gives back a gate that any task can be passed through. That is the
 * shape the shared-budget case needs, since the whole point is that unrelated
 * operations draw on one limit. Wrapping a single function is a line on top:
 * `const load = (id) => limit(() => fetchUser(id))`.
 *
 * Tasks start in the order they were submitted. A task submitted while a slot
 * is free starts immediately, within the same tick, rather than after a turn of
 * the event loop.
 *
 * A task that throws releases its slot and rejects its own promise only — the
 * gate keeps running and the other tasks are unaffected. Each caller must
 * handle its own rejection, exactly as if it had called the task directly.
 *
 * This limits how many run **at once**, not how often they start. Use
 * `rateLimitRun` for a budget over time, such as sixty calls a minute.
 *
 * @param {number} [concurrency=1] The most tasks that may run at once.
 * @returns {LimitRunFn} The gate.
 * @throws {RangeError} If `concurrency` is not a positive integer.
 *
 * @example
 * const limit = limitRun(2);
 * const pages = await Promise.all(urls.map((url) => limit(() => fetch(url))));
 *
 * @example
 * // One budget shared by unrelated operations
 * const db = limitRun(5);
 * await Promise.all([
 *   db(() => query('SELECT 1')),
 *   db(() => insert(row)),
 * ]);
 *
 * @example
 * limit.active //=> 2
 * limit.pending //=> 7
 */
export default function limitRun(concurrency = 1): LimitRunFn {
  validateFlowNumber(concurrency, 'Concurrency', {
    integer: true,
    min: 1,
    allowInfinity: true,
  });

  let active = 0;
  const queue: (() => void)[] = [];

  const release = () => {
    const resume = queue.shift();

    // The slot is handed straight to the next in line rather than given up and
    // taken again. Releasing it first would leave a gap that a task submitted
    // in between could take, putting the gate over its limit and jumping the
    // queue.
    if (resume) {
      resume();
    } else {
      active--;
    }
  };

  const run = async <T>(fn: () => T | Promise<T>): Promise<T> => {
    // Reading and claiming the slot happens before any `await`, so two calls
    // made in the same tick cannot both see the same free one.
    if (active < concurrency) {
      active++;
    } else {
      await new Promise<void>((resolve) => {
        queue.push(resolve);
      });
    }

    try {
      return await fn();
    } finally {
      release();
    }
  };

  return Object.defineProperties(run, {
    active: { get: () => active },
    pending: { get: () => queue.length },
    concurrency: { value: concurrency },
  }) as LimitRunFn;
}
