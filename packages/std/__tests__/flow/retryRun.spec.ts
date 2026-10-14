import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { retryRun } from '../../src';

describe('retryRun', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  test('retries until success', async () => {
    let attempts = 0;
    const func = mock.fn(() => {
      attempts++;
      if (attempts < 3) {
        const p = Promise.reject(new Error('fail'));
        p.catch(() => {});
        return p;
      }
      return Promise.resolve('success');
    });

    const result = retryRun(func, { retries: 5, delay: 100 });
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(100);
    await clock.advanceAsync(100);

    expect(await result).toBe('success');
    expect(func).toHaveBeenCalledTimes(3);
  });

  test('throws last error after all retries fail', async () => {
    const func = mock.fn(() => {
      const p = Promise.reject(new Error('permanent fail'));
      p.catch(() => {});
      return p;
    });

    const result = retryRun(func, { retries: 2, delay: 10 });
    result.catch(() => {});

    for (let i = 0; i <= 2; i++) {
      await clock.advanceAsync(10);
    }

    await expect(result).rejects.toThrow('permanent fail');
    expect(func).toHaveBeenCalledTimes(3);
  });

  test('exponential backoff', async () => {
    const func = mock.fn(() => {
      const p = Promise.reject(new Error('fail'));
      p.catch(() => {});
      return p;
    });

    const onRetry = mock.fn();
    const result = retryRun(func, {
      retries: 3,
      delay: 100,
      backoff: 'exponential',
      onRetry,
    });
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(100);
    await clock.advanceAsync(200);
    await clock.advanceAsync(400);

    await expect(result).rejects.toThrow();
    expect(onRetry).toHaveBeenCalledTimes(3);
  });

  test('throws on invalid options', async () => {
    await expect(retryRun(async () => 'ok', { retries: -1 })).rejects.toThrow(
      'Retries must be greater than or equal to 0.',
    );

    await expect(retryRun(async () => 'ok', { retries: 1.5 })).rejects.toThrow(
      'Retries must be an integer.',
    );

    await expect(retryRun(async () => 'ok', { delay: -1 })).rejects.toThrow(
      'Delay must be greater than or equal to 0.',
    );

    await expect(
      retryRun(async () => 'ok', { backoff: 'weird' as any }),
    ).rejects.toThrow("Backoff must be either 'fixed' or 'exponential'.");

    await expect(retryRun(async () => 'ok', { jitter: -0.1 })).rejects.toThrow(
      'Jitter must be greater than or equal to 0.',
    );

    await expect(retryRun(async () => 'ok', { jitter: 1.1 })).rejects.toThrow(
      'Jitter must be less than or equal to 1.',
    );

    await expect(
      retryRun(async () => 'ok', { jitter: Number.NaN }),
    ).rejects.toThrow('Jitter must be a finite number.');

    await expect(
      retryRun(async () => 'ok', { shouldRetry: true as any }),
    ).rejects.toThrow('ShouldRetry must be a function.');

    await expect(
      retryRun(async () => 'ok', { onRetry: true as any }),
    ).rejects.toThrow('OnRetry must be a function.');

    await expect(
      retryRun(async () => 'ok', { respectRetryAfter: 1 as any }),
    ).rejects.toThrow('RespectRetryAfter must be a boolean.');
  });

  test('retries a function that throws synchronously', async () => {
    let calls = 0;
    const result = await retryRun(
      () => {
        calls++;
        if (calls < 3) throw new Error('sync boom');
        return Promise.resolve('ok');
      },
      { retries: 5, delay: 0 },
    );

    expect(result).toBe('ok');
    expect(calls).toBe(3);
  });
});

describe('Flow > retryRun retry bound', () => {
  // `Number.isInteger(1e308)` is true, so the count passed validation and drove
  // a loop with no end. With no delay the loop holds no timer either, only
  // awaited promises, so it starved the event loop rather than merely running
  // long: a timer set before the call was still unfired twenty seconds later.
  test('refuses a retry count that would never finish', async () => {
    await expect(retryRun(async () => 1, { retries: 1e308 })).rejects.toThrow(
      RangeError,
    );

    await expect(
      retryRun(async () => 1, { retries: Number.MAX_SAFE_INTEGER }),
    ).rejects.toThrow(RangeError);

    await expect(retryRun(async () => 1, { retries: 1001 })).rejects.toThrow(
      RangeError,
    );
  });

  test('does not starve the event loop', async () => {
    let timerFired = false;
    const timer = setTimeout(() => {
      timerFired = true;
    }, 5);

    await retryRun(
      async () => {
        throw new Error('always');
      },
      { retries: 1000, delay: 0 },
    ).catch(() => {});

    await new Promise((resolve) => setTimeout(resolve, 20));
    clearTimeout(timer);

    expect(timerFired).toBe(true);
  });

  test('ordinary retry counts still work', async () => {
    let calls = 0;
    const result = await retryRun(
      async () => {
        calls++;
        if (calls < 3) throw new Error('not yet');
        return 'ok';
      },
      { retries: 5, delay: 0 },
    );

    expect(result).toBe('ok');
    expect(calls).toBe(3);
  });
});

describe('retryRun > jitter', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  test('jitter randomizes the wait within ±jitter of the delay', async () => {
    const originalRandom = Math.random;
    Math.random = () => 0;
    try {
      let calls = 0;
      const func = mock.fn(() => {
        calls++;
        const p = Promise.reject(new Error('fail'));
        p.catch(() => {});
        return p;
      });

      // delay 100, jitter 0.5, random 0 → wait 50.
      const result = retryRun(func, { retries: 1, delay: 100, jitter: 0.5 });
      result.catch(() => {});

      await clock.advanceAsync(0);
      expect(calls).toBe(1);

      await clock.advanceAsync(49);
      expect(calls).toBe(1);

      await clock.advanceAsync(1);
      await expect(result).rejects.toThrow('fail');
      expect(calls).toBe(2);
    } finally {
      Math.random = originalRandom;
    }
  });

  test('jitter upper bound waits longer than the plain delay', async () => {
    const originalRandom = Math.random;
    Math.random = () => 1;
    try {
      let calls = 0;
      const func = mock.fn(() => {
        calls++;
        const p = Promise.reject(new Error('fail'));
        p.catch(() => {});
        return p;
      });

      // delay 100, jitter 0.5, random 1 → wait 150.
      const result = retryRun(func, { retries: 1, delay: 100, jitter: 0.5 });
      result.catch(() => {});

      await clock.advanceAsync(0);
      await clock.advanceAsync(100);
      expect(calls).toBe(1);

      await clock.advanceAsync(50);
      await expect(result).rejects.toThrow('fail');
      expect(calls).toBe(2);
    } finally {
      Math.random = originalRandom;
    }
  });

  test('jitter of zero behaves like no jitter', async () => {
    const func = mock.fn(() => {
      const p = Promise.reject(new Error('fail'));
      p.catch(() => {});
      return p;
    });

    const result = retryRun(func, { retries: 1, delay: 100, jitter: 0 });
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(100);

    await expect(result).rejects.toThrow('fail');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('jitter leaves a zero delay alone', async () => {
    const originalRandom = Math.random;
    Math.random = () => 1;
    try {
      let calls = 0;
      const result = retryRun(
        async () => {
          calls++;
          if (calls < 3) throw new Error('fail');
          return 'ok';
        },
        { retries: 5, delay: 0, jitter: 1 },
      );

      expect(await result).toBe('ok');
      expect(calls).toBe(3);
    } finally {
      Math.random = originalRandom;
    }
  });
});

describe('retryRun > shouldRetry', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  test('stops without retrying when the predicate returns false', async () => {
    let calls = 0;
    const onRetry = mock.fn();
    const seen: unknown[] = [];

    const result = retryRun(
      async () => {
        calls++;
        throw Object.assign(new Error('bad request'), { status: 400 });
      },
      {
        retries: 3,
        delay: 10,
        onRetry,
        shouldRetry: (error) => {
          seen.push((error as { status: number }).status);
          return (error as { status: number }).status !== 400;
        },
      },
    );
    result.catch(() => {});

    await clock.advanceAsync(0);

    await expect(result).rejects.toThrow('bad request');
    expect(calls).toBe(1);
    // Not a retry, so the retry hook never fires.
    expect(onRetry).toHaveBeenCalledTimes(0);
    expect(seen).toEqual([400]);
  });

  test('retries when the predicate returns true', async () => {
    let calls = 0;
    const result = retryRun(
      async () => {
        calls++;
        if (calls < 3) {
          throw Object.assign(new Error('unavailable'), { status: 503 });
        }
        return 'ok';
      },
      {
        retries: 3,
        delay: 10,
        shouldRetry: (error) => (error as { status: number }).status === 503,
      },
    );
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(10);
    await clock.advanceAsync(10);

    expect(await result).toBe('ok');
    expect(calls).toBe(3);
  });

  test('awaits an async predicate and passes the one-based attempt', async () => {
    const attempts: number[] = [];
    let calls = 0;

    const result = retryRun(
      async () => {
        calls++;
        throw new Error(`fail ${calls}`);
      },
      {
        retries: 3,
        delay: 10,
        shouldRetry: async (_error, attempt) => {
          attempts.push(attempt);
          return attempt < 2;
        },
      },
    );
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(10);

    await expect(result).rejects.toThrow('fail 2');
    expect(calls).toBe(2);
    expect(attempts).toEqual([1, 2]);
  });

  test('a predicate that throws rejects with the predicate error', async () => {
    const result = retryRun(
      async () => {
        throw new Error('original');
      },
      {
        retries: 3,
        delay: 0,
        shouldRetry: () => {
          throw new Error('predicate boom');
        },
      },
    );
    result.catch(() => {});

    await clock.advanceAsync(0);

    await expect(result).rejects.toThrow('predicate boom');
  });
});

describe('retryRun > respectRetryAfter', () => {
  beforeEach(() => {
    clock.freeze();
  });

  afterEach(() => {
    clock.release();
  });

  function failingWith(error: unknown) {
    return mock.fn(() => {
      const p = Promise.reject(error);
      p.catch(() => {});
      return p;
    });
  }

  test('ignored by default, even when the error carries Retry-After', async () => {
    const func = failingWith({
      status: 429,
      headers: { 'retry-after': '5' },
    });

    const result = retryRun(func, { retries: 1, delay: 100 });
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(100);

    await expect(result).rejects.toBeDefined();
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('waits the server seconds when longer than the delay', async () => {
    let calls = 0;
    const func = mock.fn(() => {
      calls++;
      const p = Promise.reject({
        status: 429,
        headers: { 'retry-after': '5' },
      });
      p.catch(() => {});
      return p;
    });

    const result = retryRun(func, {
      retries: 1,
      delay: 100,
      respectRetryAfter: true,
    });
    result.catch(() => {});

    await clock.advanceAsync(0);
    expect(calls).toBe(1);

    // The computed 100ms wait is overridden by the 5s Retry-After.
    await clock.advanceAsync(100);
    expect(calls).toBe(1);

    await clock.advanceAsync(4900);
    await expect(result).rejects.toBeDefined();
    expect(calls).toBe(2);
  });

  test('keeps the longer backoff when Retry-After is shorter', async () => {
    const func = failingWith({
      status: 503,
      headers: { 'retry-after': '0' },
    });

    const result = retryRun(func, {
      retries: 1,
      delay: 100,
      respectRetryAfter: true,
    });
    result.catch(() => {});

    await clock.advanceAsync(0);
    await clock.advanceAsync(100);

    await expect(result).rejects.toBeDefined();
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('reads an HTTP date, a Headers instance, and a nested response', async () => {
    const date = new Date(Date.now() + 2000).toUTCString();

    const fromDate = failingWith({ headers: { 'Retry-After': date } });
    const dateResult = retryRun(fromDate, {
      retries: 1,
      delay: 10,
      respectRetryAfter: true,
    });
    dateResult.catch(() => {});
    await clock.advanceAsync(0);
    await clock.advanceAsync(10);
    expect(fromDate).toHaveBeenCalledTimes(1);
    await clock.advanceAsync(1990);
    await expect(dateResult).rejects.toBeDefined();
    expect(fromDate).toHaveBeenCalledTimes(2);

    const fromHeaders = failingWith({
      headers: new Headers({ 'Retry-After': '1' }),
    });
    const headersResult = retryRun(fromHeaders, {
      retries: 1,
      delay: 10,
      respectRetryAfter: true,
    });
    headersResult.catch(() => {});
    await clock.advanceAsync(0);
    await clock.advanceAsync(10);
    expect(fromHeaders).toHaveBeenCalledTimes(1);
    await clock.advanceAsync(990);
    await expect(headersResult).rejects.toBeDefined();
    expect(fromHeaders).toHaveBeenCalledTimes(2);

    const nested = failingWith({
      response: { status: 429, headers: { 'retry-after': '1' } },
    });
    const nestedResult = retryRun(nested, {
      retries: 1,
      delay: 10,
      respectRetryAfter: true,
    });
    nestedResult.catch(() => {});
    await clock.advanceAsync(0);
    await clock.advanceAsync(10);
    expect(nested).toHaveBeenCalledTimes(1);
    await clock.advanceAsync(990);
    await expect(nestedResult).rejects.toBeDefined();
    expect(nested).toHaveBeenCalledTimes(2);
  });

  test('reads retryAfterMs directly and ignores garbage', async () => {
    const direct = failingWith({ retryAfterMs: 500 });
    const directResult = retryRun(direct, {
      retries: 1,
      delay: 10,
      respectRetryAfter: true,
    });
    directResult.catch(() => {});
    await clock.advanceAsync(0);
    await clock.advanceAsync(10);
    expect(direct).toHaveBeenCalledTimes(1);
    await clock.advanceAsync(490);
    await expect(directResult).rejects.toBeDefined();
    expect(direct).toHaveBeenCalledTimes(2);

    const garbage = failingWith({ headers: { 'retry-after': 'soon' } });
    const garbageResult = retryRun(garbage, {
      retries: 1,
      delay: 50,
      respectRetryAfter: true,
    });
    garbageResult.catch(() => {});
    await clock.advanceAsync(0);
    await clock.advanceAsync(50);
    await expect(garbageResult).rejects.toBeDefined();
    expect(garbage).toHaveBeenCalledTimes(2);
  });
});

describe('retryRun > cancellation', () => {
  // Real timers: aborting settles the retry through a promise chain the fake
  // clock does not drive (mirrors the pollRun cancellation suite).

  test('rejects at once when the signal is already aborted', async () => {
    const reason = new Error('gone');
    const controller = new AbortController();
    controller.abort(reason);
    let calls = 0;

    await expect(
      retryRun(
        async () => {
          calls++;
          return 'ok';
        },
        { retries: 3, signal: controller.signal },
      ),
    ).rejects.toBe(reason);

    expect(calls).toBe(0);
  });

  test('rejects with the reason when the signal aborts during the wait', async () => {
    const reason = new Error('stopped');
    const controller = new AbortController();
    let calls = 0;

    const promise = retryRun(
      async () => {
        calls++;
        throw new Error('fail');
      },
      { retries: 5, delay: 10_000, signal: controller.signal },
    );
    promise.catch(() => {});

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(calls).toBe(1);
    controller.abort(reason);

    await expect(promise).rejects.toBe(reason);

    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(calls).toBe(1);
  });

  test('an abort during the call itself wins over its result', async () => {
    const reason = new Error('cancelled');
    const controller = new AbortController();

    const promise = retryRun(
      () =>
        new Promise<string>((resolve) => setTimeout(() => resolve('late'), 30)),
      { retries: 3, delay: 0, signal: controller.signal },
    );
    promise.catch(() => {});

    await new Promise((resolve) => setTimeout(resolve, 5));
    controller.abort(reason);

    await expect(promise).rejects.toBe(reason);
  });
});
