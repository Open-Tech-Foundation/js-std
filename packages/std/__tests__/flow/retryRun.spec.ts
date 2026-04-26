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
});
