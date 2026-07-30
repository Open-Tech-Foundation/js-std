import { findAsync, sleep } from '../../src';

describe('Concurrency > findAsync', () => {
  test('finds the first matching element', async () => {
    expect(await findAsync([1, 2, 3], async (n) => n > 1)).toBe(2);
  });

  test('resolves undefined when none match', async () => {
    expect(await findAsync([1, 2, 3], async (n) => n > 3)).toBeUndefined();
  });

  test('resolves undefined for an empty array', async () => {
    expect(await findAsync([], async () => true)).toBeUndefined();
  });

  // The point of the index bookkeeping. Two elements match, and which one is
  // returned must depend on their index and nothing else — so the same pair
  // is checked with the timings both ways round. Taking whichever settles
  // first fails the first case; letting the last one to settle overwrite the
  // answer fails the second.
  const findMatching = (delays: Record<string, number>) =>
    findAsync(['a', 'b', 'c', 'd'], async (val) => {
      if (delays[val] === undefined) {
        return false;
      }
      await sleep(delays[val]);
      return true;
    });

  test('returns the earliest match when the later one resolves first', async () => {
    expect(await findMatching({ b: 60, d: 5 })).toBe('b');
  });

  test('returns the earliest match when the earlier one resolves first', async () => {
    expect(await findMatching({ b: 5, d: 60 })).toBe('b');
  });

  test('does not start elements at or beyond a known match', async () => {
    const seen: number[] = [];
    const res = await findAsync(
      [1, 2, 3, 4, 5],
      async (n) => {
        seen.push(n);
        return n === 2;
      },
      1,
    );

    expect(res).toBe(2);
    expect(seen).toEqual([1, 2]);
  });

  test('awaits elements before a match, which could still be earlier', async () => {
    const seen: number[] = [];

    // Index 1 resolves immediately; index 0 is slower but also matches, and
    // must still be waited for and preferred.
    const res = await findAsync([10, 20], async (n, i) => {
      if (i === 0) {
        await sleep(20);
      }
      seen.push(i);
      return true;
    });

    expect(res).toBe(10);
    expect(seen).toEqual([1, 0]);
  });

  test('honours the concurrency limit', async () => {
    let running = 0;
    let peak = 0;

    await findAsync(
      [1, 2, 3, 4, 5, 6],
      async () => {
        running++;
        peak = Math.max(peak, running);
        await Promise.resolve();
        running--;
        return false;
      },
      2,
    );

    expect(peak).toBe(2);
  });

  test('visits sparse holes like Array.prototype.find', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await findAsync(sparse, async (n, i) => {
      seen.push(i);
      return n === undefined;
    });

    expect(seen).toEqual([0, 1, 2, 3]);
    expect(res).toBeUndefined();
  });

  test('propagates a rejection from the predicate', async () => {
    await expect(
      findAsync([1, 2], async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });

  test('throws on invalid concurrency', async () => {
    await expect(findAsync([1], async () => true, 0)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
  });
});
