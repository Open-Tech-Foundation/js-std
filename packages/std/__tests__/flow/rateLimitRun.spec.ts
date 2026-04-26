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
});
