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
      1
    );
    expect(res).toEqual([1, 2, 3]);
    expect(maxRunning).toBe(1);
  });
});
