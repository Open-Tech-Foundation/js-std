import { arrIns } from '../../src';

describe('Array', () => {
  test('arrIns', () => {
    expect(arrIns()).toEqual([]);
    expect(arrIns([])).toEqual([]);
    expect(arrIns([1])).toEqual([1]);
    expect(arrIns([1], 0)).toEqual([1]);
    expect(arrIns([1], 0, 0)).toEqual([0, 1]);
    expect(arrIns([1], 1, 0)).toEqual([1, 0]);
    expect(arrIns([1, 2, 3], 1, 5)).toEqual([1, 5, 2, 3]);
    expect(arrIns([1, 2, 3], -1, 5)).toEqual([1, 2, 5, 3]);
    expect(arrIns([1, 2, 3], -3, 5)).toEqual([5, 1, 2, 3]);
    expect(arrIns([1, 2, 3], 3, 5)).toEqual([1, 2, 3, 5]);
    expect(arrIns([1, 2, 3], 3, 5, 6)).toEqual([1, 2, 3, 5, 6]);
    expect(arrIns([1, 2, 3], null, 5, 6)).toEqual([1, 2, 3, 5, 6]);
    expect(arrIns([1, 2, 3], undefined, 5, 6)).toEqual([1, 2, 3, 5, 6]);
    expect(arrIns([1, 2, 3], 0, [5, 6])).toEqual([[5, 6], 1, 2, 3]);
    expect(arrIns([1, 2, 3], 0, ...[5, 6])).toEqual([5, 6, 1, 2, 3]);
  });
});
