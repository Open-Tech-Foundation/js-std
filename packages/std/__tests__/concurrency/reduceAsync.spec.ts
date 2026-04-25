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
      'Reduce of empty array with no initial value'
    );
  });
});
