import { aForEach } from '../../src';

describe('Array > aForEach', () => {
  test('async fn in cb fn', async () => {
    const flatten = async (val) => {
      return new Promise((resolve) => {
        Array.isArray(val) ? resolve(val.flat()) : resolve(val);
      });
    };

    const nested = [1, 2, 3, [4, 5, [6, 7], 8, 9]];
    const tmpArr = [];
    await aForEach(nested, async (n) => {
      const val = await flatten(n);
      Array.isArray(val) ? tmpArr.push(...val) : tmpArr.push(val);
    });
    expect(tmpArr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('cb fn index', async () => {
    const arr = [1, 2, 3];
    const out = [];
    await aForEach(arr, (_e, i) => out.push(i));
    expect(out).toEqual([0, 1, 2]);
  });
});
