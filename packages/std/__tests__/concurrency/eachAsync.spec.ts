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
        2
      )
    ).rejects.toThrow('Fail');
    expect(result.length).toBeLessThan(arr.length);
  });
});
