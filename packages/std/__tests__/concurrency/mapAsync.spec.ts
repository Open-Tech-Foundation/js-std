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
      2,
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

  test('mapAsync error handling', async () => {
    let callCount = 0;
    try {
      await mapAsync(
        [1, 2, 3, 4, 5],
        async (n) => {
          callCount++;
          if (n === 2) {
            throw new Error('failed');
          }
          await new Promise((resolve) => setTimeout(resolve, 20));
          return n;
        },
        2,
      );
    } catch (err) {
      expect((err as Error).message).toBe('failed');
    }
    // With concurrency 2, when n=2 fails, workers should stop.
    // However, some items might have already been picked up.
    // 1 and 2 are picked up by worker 1 and 2.
    // 2 fails. Worker 1 might still be processing 1.
    // Total calls should be less than 5.
    expect(callCount).toBeLessThan(5);
  });
});
