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
});
