import { retryRun } from '../../src';

describe('retryRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('retries until success', async () => {
    let attempts = 0;
    const func = vi.fn(() => {
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

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(100);

    expect(await result).toBe('success');
    expect(func).toHaveBeenCalledTimes(3);
  });

  test('throws last error after all retries fail', async () => {
    const func = vi.fn(() => {
      const p = Promise.reject(new Error('permanent fail'));
      p.catch(() => {});
      return p;
    });

    const result = retryRun(func, { retries: 2, delay: 10 });
    result.catch(() => {});

    for (let i = 0; i <= 2; i++) {
      await vi.advanceTimersByTimeAsync(10);
    }

    await expect(result).rejects.toThrow('permanent fail');
    expect(func).toHaveBeenCalledTimes(3);
  });

  test('exponential backoff', async () => {
    const func = vi.fn(() => {
      const p = Promise.reject(new Error('fail'));
      p.catch(() => {});
      return p;
    });

    const onRetry = vi.fn();
    const result = retryRun(func, {
      retries: 3,
      delay: 100,
      backoff: 'exponential',
      onRetry,
    });
    result.catch(() => {});

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(200);
    await vi.advanceTimersByTimeAsync(400);

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
  });
});

describe('Flow > retryRun retry bound', () => {
  // `Number.isInteger(1e308)` is true, so the count passed validation and drove
  // a loop with no end. With no delay the loop holds no timer either, only
  // awaited promises, so it starved the event loop rather than merely running
  // long: a timer set before the call was still unfired twenty seconds later.
  test('refuses a retry count that would never finish', async () => {
    await expect(
      retryRun(async () => 1, { retries: 1e308 }),
    ).rejects.toThrow(RangeError);

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
