import { eachAsync } from '../../src';

describe('Array > eachAsync', () => {
  test('iterates over each element', async () => {
    const arr = [1, 2, 3];
    const result = [];

    function process(n) {
      return new Promise((resolve) => {
        result.push(n * 2);
        resolve();
      });
    }

    await eachAsync(arr, async (n) => await process(n));

    expect(result).toEqual([2, 4, 6]);
  });

  test('stops if error occurs', async () => {
    const arr = [1, 2, 3, 4, 5];
    const result = [];
    await expect(
      eachAsync(
        arr,
        async (n) => {
          if (n === 3) throw new Error('Fail');
          result.push(n);
        },
        2,
      ),
    ).rejects.toThrow('Fail');
    expect(result.length).toBeLessThan(arr.length);
  });

  test('throws on invalid concurrency', async () => {
    const cb = async () => {};

    await expect(eachAsync([1], cb, 0)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
    await expect(eachAsync([1], cb, Number.NEGATIVE_INFINITY)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
  });

  test('skips sparse holes like Array.prototype.forEach', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];

    await eachAsync(sparse, async (_n, i) => {
      seen.push(i);
    });

    expect(seen).toEqual([1, 3]);
  });
});
