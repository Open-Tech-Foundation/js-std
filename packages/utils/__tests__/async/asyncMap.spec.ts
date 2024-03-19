import { asyncMap } from '../../src';

describe('Array', () => {
  test('asyncMap', async () => {
    const arr = [1, 2, 3, 4, 5];

    function multiply(n, i) {
      return new Promise((resolve) => {
        resolve(n * i);
      });
    }

    const result = await asyncMap(arr, async (n, i) => await multiply(n, i));
    expect(result).toEqual([0, 2, 6, 12, 20]);
  });
});
