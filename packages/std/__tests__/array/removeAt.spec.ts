import { removeAt } from '../../src';

describe('Array', () => {
  test('removeAt', () => {
    expect(removeAt([1, 2, 3], 1)).toEqual([1, 3]);
    expect(removeAt([1, 2, 3, 4], 1, 2)).toEqual([1, 4]);
    expect(removeAt([1, 2, 3], 0)).toEqual([2, 3]);
    expect(removeAt([1, 2, 3], 2)).toEqual([1, 2]);
    expect(removeAt([], 0)).toEqual([]);
    expect(removeAt()).toEqual([]);
  });
});
