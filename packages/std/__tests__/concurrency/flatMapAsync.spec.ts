import { flatMapAsync } from '../../src';

describe('flatMapAsync', () => {
  test('flatMapAsync', async () => {
    const res = await flatMapAsync([1, 2, 3], async (n) => [n, n * 2]);
    expect(res).toEqual([1, 2, 2, 4, 3, 6]);
  });

  test('flatMapAsync with concurrency', async () => {
    let running = 0;
    let maxRunning = 0;
    const res = await flatMapAsync(
      [1, 2, 3],
      async (n) => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((resolve) => setTimeout(resolve, 10));
        running--;
        return [n];
      },
      1,
    );
    expect(res).toEqual([1, 2, 3]);
    expect(maxRunning).toBe(1);
  });

  test('throws on invalid concurrency', async () => {
    await expect(flatMapAsync([1], async (n) => [n], 0)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
  });

  test('skips sparse holes like Array.prototype.flatMap', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await flatMapAsync(sparse, async (n, i) => {
      seen.push(i);
      return [n, n * 2];
    });

    expect(seen).toEqual([1, 3]);
    expect(res).toEqual([1, 2, 2, 4]);
  });
});
