import { reduceAsync } from '../../src';

describe('reduceAsync', () => {
  test('reduceAsync with initial value', async () => {
    const res = await reduceAsync([1, 2, 3], async (acc, n) => acc + n, 0);
    expect(res).toBe(6);
  });

  test('reduceAsync without initial value', async () => {
    const res = await reduceAsync([1, 2, 3], async (acc, n) => acc + n);
    expect(res).toBe(6);
  });

  test('reduceAsync empty array error', async () => {
    await expect(reduceAsync([], async (acc, n) => acc + n)).rejects.toThrow(
      'Reduce of empty array with no initial value',
    );
  });

  test('reduceAsync skips sparse holes like Array.prototype.reduce', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await reduceAsync(sparse, async (acc, n, i) => {
      seen.push(i);
      return acc + n;
    }, 0);

    expect(seen).toEqual([1, 3]);
    expect(res).toBe(3);
  });

  test('reduceAsync without initial value starts at first present item', async () => {
    const sparse = [, 1, , 2] as number[];
    const seen: number[] = [];
    const res = await reduceAsync(sparse, async (acc, n, i) => {
      seen.push(i);
      return acc + n;
    });

    expect(seen).toEqual([3]);
    expect(res).toBe(3);
  });
});
