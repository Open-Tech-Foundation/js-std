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

  test('throws on invalid concurrency', async () => {
    await expect(filterAsync([1], async () => true, 0)).rejects.toThrow(
      'Concurrency must be a positive integer or Infinity.',
    );
  });

  test('skips sparse holes like Array.prototype.filter', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await filterAsync(sparse, async (n, i) => {
      seen.push(i);
      return n > 1;
    });

    expect(seen).toEqual([1, 3]);
    expect(res).toEqual([2]);
  });
});
