import { pollRun } from '../../src';

describe('pollRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Advances one interval at a time, since each wait is only scheduled once
   *  the one before it has fired. */
  async function tick(...steps: number[]) {
    for (const step of steps) {
      await vi.advanceTimersByTimeAsync(step);
    }
  }

  test('returns the first result that satisfies the condition', async () => {
    const statuses = ['pending', 'pending', 'done'];
    let calls = 0;

    const promise = pollRun(() => statuses[calls++], {
      until: (status) => status === 'done',
      interval: 100,
    });

    await tick(0, 100, 100);

    expect(await promise).toBe('done');
    expect(calls).toBe(3);
  });

  test('runs the first attempt immediately, with no wait', async () => {
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return 'ready';
      },
      { until: (v) => v === 'ready', interval: 10_000 },
    );

    // No time passes at all.
    await tick(0);

    expect(await promise).toBe('ready');
    expect(calls).toBe(1);
  });

  test('passes the one-based attempt number to the condition', async () => {
    const seen: number[] = [];

    const promise = pollRun(() => 'x', {
      until: (_v, attempt) => {
        seen.push(attempt);
        return attempt === 3;
      },
      interval: 50,
    });

    await tick(0, 50, 50);
    await promise;

    expect(seen).toEqual([1, 2, 3]);
  });

  test('awaits an async condition', async () => {
    const promise = pollRun(async () => 1, { until: async (v) => v === 1 });

    await tick(0);

    expect(await promise).toBe(1);
  });

  test('waits the interval between attempts', async () => {
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return calls;
      },
      { until: (n) => n === 3, interval: 100 },
    );
    promise.catch(() => {});

    await tick(0);
    expect(calls).toBe(1);

    await tick(99);
    expect(calls).toBe(1);

    await tick(1);
    expect(calls).toBe(2);

    await tick(100);
    expect(await promise).toBe(3);
  });

  test('doubles the wait with exponential backoff', async () => {
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return calls;
      },
      { until: (n) => n === 4, interval: 100, backoff: 'exponential' },
    );
    promise.catch(() => {});

    await tick(0);
    expect(calls).toBe(1);

    await tick(100);
    expect(calls).toBe(2);

    // The third wait is 200, not another 100.
    await tick(199);
    expect(calls).toBe(2);
    await tick(1);
    expect(calls).toBe(3);

    await tick(400);
    expect(await promise).toBe(4);
  });

  test('gives up after the maximum attempts', async () => {
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return 'never';
      },
      { until: () => false, interval: 10, attempts: 3 },
    );
    promise.catch(() => {});

    await tick(0, 10, 10);
    await expect(promise).rejects.toThrow(/3 attempts/);

    expect(calls).toBe(3);
  });

  test('stops polling once the timeout is reached', async () => {
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return 'never';
      },
      { until: () => false, interval: 100, timeout: 250 },
    );
    promise.catch(() => {});

    await tick(0, 100, 100, 50);
    await expect(promise).rejects.toThrow(/within 250ms/);

    const callsAtTimeout = calls;
    expect(callsAtTimeout).toBe(3);

    // Nothing keeps polling behind the rejection.
    await tick(1000, 1000);
    expect(calls).toBe(callsAtTimeout);
  });

  test('holds the timeout even while the call itself is slow', async () => {
    const promise = pollRun(
      () => new Promise((resolve) => setTimeout(() => resolve('late'), 5000)),
      { until: () => true, timeout: 100 },
    );
    promise.catch(() => {});

    // The single call has not returned; the timeout must not wait for it.
    await tick(100);
    await expect(promise).rejects.toThrow(/within 100ms/);
  });

  test('rejects immediately when the polled function throws', async () => {
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        throw new Error('boom');
      },
      { until: () => true, interval: 100 },
    );
    promise.catch(() => {});

    await tick(0);
    await expect(promise).rejects.toThrow('boom');

    // An error is a failure, not a `false` in disguise. `retryRun` is the one
    // that repeats on failure.
    expect(calls).toBe(1);
  });

  test('rejects when the condition itself throws', async () => {
    const promise = pollRun(() => 1, {
      until: () => {
        throw new Error('bad condition');
      },
    });
    promise.catch(() => {});

    await tick(0);
    await expect(promise).rejects.toThrow('bad condition');
  });

  test('rejects at once when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    let calls = 0;

    await expect(
      pollRun(
        () => {
          calls++;
          return 'x';
        },
        { until: () => true, signal: controller.signal },
      ),
    ).rejects.toThrow();

    expect(calls).toBe(0);
  });

  test('rejects an invalid option', () => {
    expect(() => pollRun(() => 1, { until: () => true, interval: -1 })).toThrow(
      RangeError,
    );
    expect(() => pollRun(() => 1, { until: () => true, attempts: 0 })).toThrow(
      RangeError,
    );
    expect(() =>
      pollRun(() => 1, { until: () => true, attempts: 1.5 }),
    ).toThrow(RangeError);
    expect(() => pollRun(() => 1, { until: () => true, timeout: -1 })).toThrow(
      RangeError,
    );
    expect(() =>
      pollRun(() => 1, { until: () => true, backoff: 'linear' as never }),
    ).toThrow(RangeError);
    expect(() => pollRun(() => 1, {} as never)).toThrow(TypeError);
  });
});

describe('pollRun > cancellation', () => {
  // Real timers: an abort settles the poll through several links of a promise
  // chain, which the fake clock does not drive.

  test('rejects with the reason when the signal aborts', async () => {
    const controller = new AbortController();
    // An explicit reason, so this asserts what pollRun passes on rather than
    // how a given runtime words its default `AbortError`.
    const reason = new Error('stopped');
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return 'never';
      },
      { until: () => false, interval: 20, signal: controller.signal },
    );
    promise.catch(() => {});

    await new Promise((resolve) => setTimeout(resolve, 50));
    const callsAtAbort = calls;
    controller.abort(reason);

    await expect(promise).rejects.toBe(reason);

    // Nothing keeps polling behind the rejection.
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(calls).toBe(callsAtAbort);
  });

  test('stops the pending wait rather than leaving a timer open', async () => {
    const controller = new AbortController();
    let calls = 0;

    const promise = pollRun(
      () => {
        calls++;
        return 'never';
      },
      { until: () => false, interval: 10_000, signal: controller.signal },
    );
    promise.catch(() => {});

    await new Promise((resolve) => setTimeout(resolve, 10));
    controller.abort();

    // The poll settles now rather than in ten seconds' time.
    await expect(promise).rejects.toThrow();
    expect(calls).toBe(1);
  });

  test('leaves no abort listener behind on a reused signal', async () => {
    const controller = new AbortController();
    const { signal } = controller;
    let added = 0;
    let removed = 0;

    const add = signal.addEventListener.bind(signal);
    const remove = signal.removeEventListener.bind(signal);
    signal.addEventListener = ((...args: Parameters<typeof add>) => {
      if (args[0] === 'abort') added++;
      return add(...args);
    }) as typeof add;
    signal.removeEventListener = ((...args: Parameters<typeof remove>) => {
      if (args[0] === 'abort') removed++;
      return remove(...args);
    }) as typeof remove;

    for (let i = 0; i < 5; i++) {
      await pollRun(() => i, { until: () => true, signal });
    }

    // One listener per call is attached; a listener kept per call would grow
    // without bound on a signal held across many polls.
    expect(added).toBe(5);
    expect(removed).toBe(5);
  });

  test('accepts an interval of zero', async () => {
    let calls = 0;

    const res = await pollRun(
      () => {
        calls++;
        return calls;
      },
      { until: (n) => n === 3, interval: 0 },
    );

    expect(res).toBe(3);
    expect(calls).toBe(3);
  });
});
