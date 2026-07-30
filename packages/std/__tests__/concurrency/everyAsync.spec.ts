import { everyAsync } from '../../src';

describe('Concurrency > everyAsync', () => {
  test('resolves true when every element matches', async () => {
    expect(await everyAsync([2, 4, 6], async (n) => n % 2 === 0)).toBe(true);
  });

  test('resolves false when one fails', async () => {
    expect(await everyAsync([2, 3, 4], async (n) => n % 2 === 0)).toBe(false);
  });

  test('resolves true for an empty array', async () => {
    expect(await everyAsync([], async () => false)).toBe(true);
  });

  test('stops starting elements once one fails', async () => {
    const seen: number[] = [];
    const res = await everyAsync(
      [1, 2, 3, 4, 5],
      async (n) => {
        seen.push(n);
        return n !== 2;
      },
      1,
    );

    expect(res).toBe(false);
    expect(seen).toEqual([1, 2]);
  });

  test('honours the concurrency limit', async () => {
    let running = 0;
    let peak = 0;

    await everyAsync(
      [1, 2, 3, 4, 5, 6],
      async () => {
        running++;
        peak = Math.max(peak, running);
        await Promise.resolve();
        running--;
        return true;
      },
      2,
    );

    expect(peak).toBe(2);
  });

  test('skips sparse holes like Array.prototype.every', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await everyAsync(sparse, async (n, i) => {
      seen.push(i);
      return n > 0;
    });

    expect(seen).toEqual([1, 3]);
    expect(res).toBe(true);
  });

  test('propagates a rejection from the predicate', async () => {
    await expect(
      everyAsync([1, 2], async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });

  test('throws on invalid concurrency', async () => {
    await expect(everyAsync([1], async () => true, 0)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
  });
});
