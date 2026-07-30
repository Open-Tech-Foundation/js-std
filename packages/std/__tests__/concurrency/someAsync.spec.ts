import { someAsync } from '../../src';

describe('Concurrency > someAsync', () => {
  test('resolves true when an element matches', async () => {
    expect(await someAsync([1, 2, 3], async (n) => n > 2)).toBe(true);
  });

  test('resolves false when none match', async () => {
    expect(await someAsync([1, 2, 3], async (n) => n > 3)).toBe(false);
  });

  test('resolves false for an empty array', async () => {
    expect(await someAsync([], async () => true)).toBe(false);
  });

  test('stops starting elements once one matches', async () => {
    const seen: number[] = [];
    const res = await someAsync(
      [1, 2, 3, 4, 5],
      async (n) => {
        seen.push(n);
        return n === 2;
      },
      1,
    );

    expect(res).toBe(true);
    expect(seen).toEqual([1, 2]);
  });

  test('runs in parallel by default', async () => {
    let running = 0;
    let peak = 0;

    await someAsync([1, 2, 3, 4], async () => {
      running++;
      peak = Math.max(peak, running);
      await Promise.resolve();
      running--;
      return false;
    });

    expect(peak).toBe(4);
  });

  test('honours the concurrency limit', async () => {
    let running = 0;
    let peak = 0;

    await someAsync(
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

  test('skips sparse holes like Array.prototype.some', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await someAsync(sparse, async (n, i) => {
      seen.push(i);
      return n > 1;
    });

    expect(seen).toEqual([1, 3]);
    expect(res).toBe(true);
  });

  test('propagates a rejection from the predicate', async () => {
    await expect(
      someAsync([1, 2], async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });

  test('throws on invalid concurrency', async () => {
    await expect(someAsync([1], async () => true, 0)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
  });
});
