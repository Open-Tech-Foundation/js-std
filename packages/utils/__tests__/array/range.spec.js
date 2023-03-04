import { range } from '../../src';

describe('Array', () => {
  test('range', () => {
    expect(range()).toEqual([]);
    expect(range(0)).toEqual([]);
    expect(range(1)).toEqual([]);
    expect(range(1, 2)).toEqual([1, 2]);
    expect(range(10, 50, 10)).toEqual([10, 20, 30, 40, 50]);
    expect(range(10, 12, 0.5)).toEqual([10, 10.5, 11, 11.5, 12]);
    expect(range(-10, -5)).toEqual([-10, -9, -8, -7, -6, -5]);
    expect(range(0, -4, -1)).toEqual([0, -1, -2, -3, -4]);
    expect(range(-4)).toEqual([]);
    expect(range(1, 2, 0)).toEqual([]);
    expect(range(-1, -2, 1)).toEqual([]);
    expect(range(-1, -2, -1)).toEqual([-1, -2]);
    expect(range(1, 2, 1)).toEqual([1, 2]);
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(range(3, 9, 3)).toEqual([3, 6, 9]);
  });
});
