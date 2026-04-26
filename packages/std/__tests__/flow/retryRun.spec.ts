import { retryRun } from '../../src';

if (typeof vi !== 'undefined' && !vi.advanceTimersByTimeAsync) {
  vi.advanceTimersByTimeAsync = async (ms: number) => {
    vi.advanceTimersByTime(ms);
    for (let i = 0; i < 10; i++) await Promise.resolve();
  };
}

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
    result.catch(() => {}); // Prevent unhandled rejection warning
    
    // Initial attempt fails
    await vi.advanceTimersByTimeAsync(0);
    // 1st retry
    await vi.advanceTimersByTimeAsync(100);
    // 2nd retry
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
    result.catch(() => {}); // Prevent unhandled rejection warning
    
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
      onRetry 
    });
    result.catch(() => {}); // Prevent unhandled rejection warning

    await vi.advanceTimersByTimeAsync(0); // Attempt 0
    await vi.advanceTimersByTimeAsync(100); // Attempt 1 (delay 100)
    await vi.advanceTimersByTimeAsync(200); // Attempt 2 (delay 200)
    await vi.advanceTimersByTimeAsync(400); // Attempt 3 (delay 400)

    await expect(result).rejects.toThrow();
    expect(onRetry).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenNthCalledWith(1, expect.any(Error), 1);
    expect(onRetry).toHaveBeenNthCalledWith(2, expect.any(Error), 2);
    expect(onRetry).toHaveBeenNthCalledWith(3, expect.any(Error), 3);
  });
});
