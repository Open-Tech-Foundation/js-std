import { asyncForEach } from '../../src';

describe('Array', () => {
  test('asyncForEach', async () => {
    const flatten = async (val) => {
      return new Promise((resolve) => {
        Array.isArray(val) ? resolve(val.flat()) : resolve(val);
      });
    };

    const nested = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
    const tmpArr = [];
    await asyncForEach(nested, async (n) => {
      const val = await flatten(n);
      Array.isArray(val) ? tmpArr.push(...val) : tmpArr.push(val);
    });
    expect(tmpArr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
