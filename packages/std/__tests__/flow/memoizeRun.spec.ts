import { memoizeRun } from '../../src';

describe('memoizeRun', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('caches the result', async () => {
    const func = vi.fn(async (n: number) => n * 2);
    const memoized = memoizeRun(func);

    const r1 = await memoized(5);
    const r2 = await memoized(5);

    expect(r1).toBe(10);
    expect(r2).toBe(10);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('Single Flight: concurrent calls share the same promise', async () => {
    let calls = 0;
    const func = async (n: number) => {
      calls++;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return n * 2;
    };
    const memoized = memoizeRun(func);

    const p1 = memoized(5);
    const p2 = memoized(5);

    vi.advanceTimersByTime(100);

    const [r1, r2] = await Promise.all([p1, p2]);

    expect(r1).toBe(10);
    expect(r2).toBe(10);
    expect(calls).toBe(1);
  });

  test('TTL (maxAge) expires the cache', async () => {
    const func = vi.fn(async (n: number) => n * 2);
    const memoized = memoizeRun(func, { maxAge: 1000 });

    await memoized(5);

    vi.advanceTimersByTime(500);
    await memoized(5);
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(600); // Total 1100ms
    await memoized(5);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('removes failed promises from cache', async () => {
    let shouldFail = true;
    const func = vi.fn(() => {
      if (shouldFail) throw new Error('fail');
      return 'ok';
    });
    const memoized = memoizeRun(func);

    await expect(memoized()).rejects.toThrow('fail');

    shouldFail = false;
    const result = await memoized();
    expect(result).toBe('ok');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('custom key function', async () => {
    const func = vi.fn(async (obj: { id: number }) => obj.id);
    const memoized = memoizeRun(func, { key: (obj) => String(obj.id) });

    await memoized({ id: 1 });
    await memoized({ id: 1 });

    expect(func).toHaveBeenCalledTimes(1);
  });

  test('clear method', async () => {
    const func = vi.fn(async (n: number) => n * 2);
    const memoized = memoizeRun(func);

    await memoized(5);
    memoized.clear();
    await memoized(5);

    expect(func).toHaveBeenCalledTimes(2);
  });

  test('supports bigint arguments without a custom key', async () => {
    const func = vi.fn(async (n: bigint) => n * 2n);
    const memoized = memoizeRun(func);

    const r1 = await memoized(5n);
    const r2 = await memoized(5n);

    expect(r1).toBe(10n);
    expect(r2).toBe(10n);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('supports cyclic arguments without a custom key', async () => {
    const func = vi.fn(async (obj: { self?: unknown; a: number }) => obj.a);
    const memoized = memoizeRun(func);

    const a: { self?: unknown; a: number } = { a: 1 };
    a.self = a;
    const b: { self?: unknown; a: number } = { a: 1 };
    b.self = b;

    const r1 = await memoized(a);
    const r2 = await memoized(b);

    expect(r1).toBe(1);
    expect(r2).toBe(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('supports structural map and set arguments without a custom key', async () => {
    const func = vi.fn(async (map: Map<string, number>, set: Set<number>) => {
      return map.get('a')! + set.size;
    });
    const memoized = memoizeRun(func);

    const r1 = await memoized(new Map([['a', 1]]), new Set([1, 2]));
    const r2 = await memoized(new Map([['a', 1]]), new Set([1, 2]));

    expect(r1).toBe(3);
    expect(r2).toBe(3);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('treats unsupported object instances by reference without a custom key', async () => {
    class Box {
      constructor(public value: number) {}
    }

    const func = vi.fn(async (box: Box) => box.value);
    const memoized = memoizeRun(func);

    const boxA = new Box(1);
    const boxB = new Box(1);

    await memoized(boxA);
    await memoized(boxA);
    await memoized(boxB);

    expect(func).toHaveBeenCalledTimes(2);
  });
});
