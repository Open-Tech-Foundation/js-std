import { mapAsync } from '../../src';

describe('mapAsync', () => {
  test('mapAsync', async () => {
    const res = await mapAsync([1, 2, 3], (n) => Promise.resolve(n * 2));
    expect(res).toEqual([2, 4, 6]);
  });

  test('mapAsync with concurrency', async () => {
    let running = 0;
    let maxRunning = 0;
    const res = await mapAsync(
      [1, 2, 3, 4, 5],
      async (n) => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((resolve) => setTimeout(resolve, 10));
        running--;
        return n * 2;
      },
      2
    );
    expect(res).toEqual([2, 4, 6, 8, 10]);
    expect(maxRunning).toBe(2);
  });

  test('mapAsync parallel by default', async () => {
    let running = 0;
    let maxRunning = 0;
    await mapAsync([1, 2, 3, 4, 5], async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((resolve) => setTimeout(resolve, 10));
      running--;
    });
    expect(maxRunning).toBe(5);
  });
});
