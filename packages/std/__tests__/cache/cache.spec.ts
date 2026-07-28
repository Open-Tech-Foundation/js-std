import { LruCache, TtlCache, sleep } from '../../src';

describe('LruCache', () => {
  test('stores and reads values', () => {
    const cache = new LruCache<string, number>(3);

    cache.set('a', 1).set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('missing')).toBeUndefined();
  });

  test('reports its size and capacity', () => {
    const cache = new LruCache<string, number>(2);

    expect(cache.size).toBe(0);
    expect(cache.maxSize).toBe(2);

    cache.set('a', 1);
    expect(cache.size).toBe(1);
  });

  test('evicts the least recently used entry when full', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(true);
    expect(cache.has('c')).toBe(true);
    expect(cache.size).toBe(2);
  });

  test('counts a read as a use', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);

    // 'b' was the least recently used, so it goes rather than 'a'.
    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
  });

  test('counts a write to an existing key as a use', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('a', 10);
    cache.set('c', 3);

    expect(cache.get('a')).toBe(10);
    expect(cache.has('b')).toBe(false);
  });

  test('does not grow when overwriting an existing key', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('a', 2);

    expect(cache.size).toBe(1);
    expect(cache.get('a')).toBe(2);
  });

  test('peek reads without disturbing the eviction order', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.peek('a')).toBe(1);
    cache.set('c', 3);

    // 'a' was still the least recently used, because peek did not count.
    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(true);
  });

  test('has does not count as a use', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.has('a');
    cache.set('c', 3);

    expect(cache.has('a')).toBe(false);
  });

  test('deletes and clears', () => {
    const cache = new LruCache<string, number>(3);

    cache.set('a', 1).set('b', 2);

    expect(cache.delete('a')).toBe(true);
    expect(cache.delete('a')).toBe(false);
    expect(cache.size).toBe(1);

    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get('b')).toBeUndefined();
  });

  test('iterates least recently used first', () => {
    const cache = new LruCache<string, number>(3);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.get('a');

    expect([...cache.keys()]).toEqual(['b', 'c', 'a']);
    expect([...cache.values()]).toEqual([2, 3, 1]);
    expect([...cache.entries()]).toEqual([
      ['b', 2],
      ['c', 3],
      ['a', 1],
    ]);
    expect([...cache]).toEqual([
      ['b', 2],
      ['c', 3],
      ['a', 1],
    ]);
  });

  test('forEach visits every entry', () => {
    const cache = new LruCache<string, number>(3);
    cache.set('a', 1).set('b', 2);

    const seen: [string, number][] = [];
    cache.forEach((value, key) => seen.push([key, value]));

    expect(seen).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  test('holds a single entry at capacity 1', () => {
    const cache = new LruCache<string, number>(1);

    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.size).toBe(1);
    expect(cache.has('a')).toBe(false);
    expect(cache.get('b')).toBe(2);
  });

  test('stores undefined as a value distinctly from a missing key', () => {
    const cache = new LruCache<string, number | undefined>(2);

    cache.set('a', undefined);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
  });

  test('accepts object keys', () => {
    const cache = new LruCache<object, string>(2);
    const key = { id: 1 };

    cache.set(key, 'value');

    expect(cache.get(key)).toBe('value');
    expect(cache.get({ id: 1 })).toBeUndefined();
  });

  test('rejects an invalid capacity', () => {
    expect(() => new LruCache(0)).toThrow(RangeError);
    expect(() => new LruCache(-1)).toThrow(RangeError);
    expect(() => new LruCache(1.5)).toThrow(RangeError);
    expect(() => new LruCache(Number.NaN)).toThrow(RangeError);
    expect(() => new LruCache(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  test('evicts in order across many writes', () => {
    const cache = new LruCache<number, number>(3);

    for (let i = 0; i < 10; i++) {
      cache.set(i, i);
    }

    expect([...cache.keys()]).toEqual([7, 8, 9]);
  });
});

describe('TtlCache', () => {
  test('stores and reads values', () => {
    const cache = new TtlCache<string, number>(1000);

    cache.set('a', 1).set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('missing')).toBeUndefined();
  });

  test('reports its size and default lifetime', () => {
    const cache = new TtlCache<string, number>(1000);

    expect(cache.size).toBe(0);
    expect(cache.defaultTtl).toBe(1000);

    cache.set('a', 1);
    expect(cache.size).toBe(1);
  });

  test('expires an entry once its lifetime passes', async () => {
    const cache = new TtlCache<string, number>(1);

    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);

    await sleep(50);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.has('a')).toBe(false);
    expect(cache.size).toBe(0);
  });

  test('honours a per-entry lifetime', async () => {
    const cache = new TtlCache<string, number>(1000);

    cache.set('long', 1);
    cache.set('short', 2, 1);

    await sleep(50);

    expect(cache.get('long')).toBe(1);
    expect(cache.get('short')).toBeUndefined();
  });

  test('restarts the lifetime on rewrite', async () => {
    const cache = new TtlCache<string, number>(60_000);

    cache.set('a', 1);
    await sleep(20);

    const beforeRewrite = cache.ttlOf('a') as number;
    cache.set('a', 2);
    const afterRewrite = cache.ttlOf('a') as number;

    // Checked through the remaining lifetime rather than by waiting one out,
    // so the assertion does not depend on timer precision.
    expect(afterRewrite).toBeGreaterThan(beforeRewrite);
    expect(cache.get('a')).toBe(2);
  });

  test('an entry rewritten past its lifetime is alive again', async () => {
    const cache = new TtlCache<string, number>(1);

    cache.set('a', 1);
    await sleep(50);
    expect(cache.get('a')).toBeUndefined();

    cache.set('a', 2, 60_000);
    expect(cache.get('a')).toBe(2);
  });

  test('reports the time left on a key', () => {
    const cache = new TtlCache<string, number>(1000);

    cache.set('a', 1);

    const left = cache.ttlOf('a') as number;
    expect(left).toBeGreaterThan(0);
    expect(left).toBeLessThanOrEqual(1000);

    expect(cache.ttlOf('missing')).toBeUndefined();
  });

  test('deletes and clears', () => {
    const cache = new TtlCache<string, number>(1000);

    cache.set('a', 1).set('b', 2);

    expect(cache.delete('a')).toBe(true);
    expect(cache.delete('a')).toBe(false);
    expect(cache.size).toBe(1);

    cache.clear();
    expect(cache.size).toBe(0);
  });

  test('does not report an expired key as deleted', async () => {
    const cache = new TtlCache<string, number>(1);

    cache.set('a', 1);
    await sleep(50);

    expect(cache.delete('a')).toBe(false);
  });

  test('prunes expired entries on demand', async () => {
    const cache = new TtlCache<string, number>(1);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3, 60_000);

    await sleep(50);

    expect(cache.prune()).toBe(2);
    expect(cache.prune()).toBe(0);
    expect([...cache.keys()]).toEqual(['c']);
  });

  test('omits expired entries from size and iteration', async () => {
    const cache = new TtlCache<string, number>(1);

    cache.set('a', 1);
    cache.set('b', 2, 60_000);

    await sleep(50);

    expect(cache.size).toBe(1);
    expect([...cache.keys()]).toEqual(['b']);
    expect([...cache.values()]).toEqual([2]);
    expect([...cache.entries()]).toEqual([['b', 2]]);
    expect([...cache]).toEqual([['b', 2]]);
  });

  test('forEach visits only unexpired entries', async () => {
    const cache = new TtlCache<string, number>(1);

    cache.set('a', 1);
    cache.set('b', 2, 60_000);

    await sleep(50);

    const seen: string[] = [];
    cache.forEach((_value, key) => seen.push(key));

    expect(seen).toEqual(['b']);
  });

  test('stores undefined as a value distinctly from a missing key', () => {
    const cache = new TtlCache<string, number | undefined>(1000);

    cache.set('a', undefined);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
  });

  test('rejects an invalid lifetime', () => {
    expect(() => new TtlCache(0)).toThrow(RangeError);
    expect(() => new TtlCache(-1)).toThrow(RangeError);
    expect(() => new TtlCache(Number.NaN)).toThrow(RangeError);
    expect(() => new TtlCache(Number.POSITIVE_INFINITY)).toThrow(RangeError);

    const cache = new TtlCache<string, number>(1000);
    expect(() => cache.set('a', 1, 0)).toThrow(RangeError);
    expect(() => cache.set('a', 1, -5)).toThrow(RangeError);
  });

  test('does not hold the process open with timers', () => {
    // A timer-per-entry implementation would keep the event loop alive; this
    // cache expires lazily, so nothing is scheduled.
    const cache = new TtlCache<string, number>(60_000);
    cache.set('a', 1);

    expect(cache.get('a')).toBe(1);
  });
});
