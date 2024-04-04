import { aMap, sleep } from '../../src';

describe('Array > aMap', () => {
  test('async map', async () => {
    const arr = [1, 2, 3, 4, 5];

    function multiply(n, i) {
      return new Promise((resolve) => {
        resolve(n * i);
      });
    }

    const result = await aMap(arr, async (n, i) => await multiply(n, i));

    expect(result).toEqual([0, 2, 6, 12, 20]);
  });
});
