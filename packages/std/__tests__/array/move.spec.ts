import { move } from '../../src';

describe('Array > move', () => {
  test('empty array', () => {
    expect(move([], 0, 1)).toEqual([]);
  });

  it('returns same ref', () => {
    const arr = [1, 5, 8];
    expect(move(arr, 0, 0)).toBe(arr);
  });

  it('returns new ref', () => {
    const arr = [1, 5, 8];
    expect(move(arr, 0, 1)).not.toBe(arr);
  });

  it('moves within range', () => {
    expect(move([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
  });

  it('moves the element to the last index if to > length', () => {
    expect(move([1, 2, 3], 0, 5)).toEqual([2, 3, 1]);
  });

  it('does not move the element', () => {
    expect(move([1, 2, 3], 5, 0)).toEqual([1, 2, 3]);
  });

  test('negative index', () => {
    expect(move([1, 2, 3, 4, 5], 0, -1)).toEqual([2, 3, 4, 1, 5]);
    expect(move([1, 2, 3, 4, 5], -1, 2)).toEqual([1, 2, 5, 3, 4]);
  });
});
