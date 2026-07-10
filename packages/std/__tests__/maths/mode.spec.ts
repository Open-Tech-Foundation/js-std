import { mode } from '../../src';

describe('Maths', () => {
  test('mode', () => {
    expect(mode()).toEqual([]);
    expect(mode([1])).toEqual([]);
    expect(mode([1, 2, 3, 4, 5])).toEqual([]);
    expect(mode([4, 2])).toEqual([]);
    expect(mode([4, 2, 3, 2, 2])).toEqual([2]);
    expect(mode([0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 4])).toEqual([1, 2]);
    expect(
      mode([{ n: 1 }, { n: 2 }, { n: 3 }, { n: 2 }], ({ n }) => n),
    ).toEqual([2]);
    expect(mode([1, , 1] as number[])).toEqual([1]);
    expect(mode([1, , 2] as number[])).toEqual([]);
    expect(
      mode([{ n: 1 }, , { n: 1 }] as { n: number }[], ({ n }) => n),
    ).toEqual([1]);
  });
});
