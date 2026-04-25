import { filterAsync } from '../../src';

describe('Array > filterAsync', () => {
  test('filters only even numbers', async () => {
    const arr = [1, 2, 3, 4, 5];

    function isEven(n) {
      return new Promise((resolve) => {
        resolve(n % 2 === 0);
      });
    }

    const filteredArr = await filterAsync(arr, async (n) => await isEven(n));

    expect(filteredArr).toEqual([2, 4]);
  });
});
