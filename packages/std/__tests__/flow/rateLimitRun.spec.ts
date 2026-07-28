import { rateLimitRun } from '../../src';

describe('rateLimitRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('limits execution frequency', async () => {
    const func = vi.fn(async (val: string) => val);
    const limited = rateLimitRun(func, 2, 1000); // 2 per second

    const p1 = limited('a');
    const p2 = limited('b');
    const p3 = limited('c');

    expect(func).toHaveBeenCalledTimes(2);
    expect(await p1).toBe('a');
    expect(await p2).toBe('b');

    vi.advanceTimersByTime(500);

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(3);
    expect(await p3).toBe('c');
  });

  test('handles rapid bursts', async () => {
    const func = vi.fn(async (val: number) => val);
    const limited = rateLimitRun(func, 1, 100);

    const results = [];
    results.push(limited(1));
    results.push(limited(2));
    results.push(limited(3));

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(3);

    expect(await Promise.all(results)).toEqual([1, 2, 3]);
  });

  test('handles rapid bursts of a synchronous function', async () => {
    const func = vi.fn((val: number) => val);
    const limited = rateLimitRun(func, 1, 100);

    const results = [limited(1), limited(2), limited(3)];

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(3);

    expect(await Promise.all(results)).toEqual([1, 2, 3]);
  });

  test('schedules one timer per drain, not one per queued call', async () => {
    // Regression: `processQueue` runs on every call and used to clear `timeoutId`
    // at the top without clearing the timer itself, orphaning it. Each queued
    // call then stacked another timer, so a large burst leaked timers unbounded.
    const realSetTimeout = globalThis.setTimeout;
    let scheduled = 0;
    globalThis.setTimeout = ((...args: Parameters<typeof setTimeout>) => {
      scheduled++;
      return realSetTimeout(...args);
    }) as typeof setTimeout;

    try {
      const limited = rateLimitRun((val: number) => val, 1, 100);
      limited(1);
      for (let i = 2; i <= 6; i++) limited(i);

      // One call runs immediately; the remaining five share a single pending timer.
      expect(scheduled).toBe(1);
    } finally {
      globalThis.setTimeout = realSetTimeout;
    }
  });

  test('a slow call does not delay the next window', async () => {
    const started: number[] = [];
    const func = vi.fn((val: number) => {
      started.push(val);
      // Never settles: the rolling window is measured from when a call starts,
      // so a pending call must not hold the queue.
      return new Promise<number>(() => {});
    });
    const limited = rateLimitRun(func, 1, 100);

    limited(1);
    limited(2);
    expect(started).toEqual([1]);

    vi.advanceTimersByTime(100);
    expect(started).toEqual([1, 2]);
  });

  test('a rejected call does not stall the queue', async () => {
    const func = vi.fn(async (val: number) => {
      if (val === 1) throw new Error('boom');
      return val;
    });
    const limited = rateLimitRun(func, 1, 100);

    const p1 = limited(1);
    const p2 = limited(2);

    await expect(p1).rejects.toThrow('boom');

    vi.advanceTimersByTime(100);
    expect(await p2).toBe(2);
  });

  test('propagates a synchronous throw', async () => {
    const func = vi.fn((val: number) => {
      if (val === 1) throw new Error('sync boom');
      return val;
    });
    const limited = rateLimitRun(func, 1, 100);

    const p1 = limited(1);
    const p2 = limited(2);

    await expect(p1).rejects.toThrow('sync boom');

    vi.advanceTimersByTime(100);
    expect(await p2).toBe(2);
  });

  test('throws on invalid limit', () => {
    const func = vi.fn(async (val: number) => val);

    expect(() => rateLimitRun(func, 0, 100)).toThrow(
      'Limit must be a positive integer.',
    );
    expect(() => rateLimitRun(func, -1, 100)).toThrow(
      'Limit must be a positive integer.',
    );
    expect(() => rateLimitRun(func, 1.5, 100)).toThrow(
      'Limit must be a positive integer.',
    );
    expect(() => rateLimitRun(func, Number.POSITIVE_INFINITY, 100)).toThrow(
      'Limit must be a positive integer.',
    );
  });

  test('throws on invalid period', () => {
    const func = vi.fn(async (val: number) => val);

    expect(() => rateLimitRun(func, 1, 0)).toThrow(
      'Period must be a positive finite number.',
    );
    expect(() => rateLimitRun(func, 1, -1)).toThrow(
      'Period must be a positive finite number.',
    );
    expect(() => rateLimitRun(func, 1, Number.NaN)).toThrow(
      'Period must be a positive finite number.',
    );
    expect(() => rateLimitRun(func, 1, Number.POSITIVE_INFINITY)).toThrow(
      'Period must be a positive finite number.',
    );
  });
});
