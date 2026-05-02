import { insertAt } from '../../src';

describe('Array', () => {
  test('insertAt', () => {
    expect(insertAt([1, 2, 3], 1, 5)).toEqual([1, 5, 2, 3]);
    expect(insertAt([1, 2, 3], 0, 5, 6)).toEqual([5, 6, 1, 2, 3]);
    expect(insertAt([1, 2, 3], 3, 4)).toEqual([1, 2, 3, 4]);
    expect(insertAt([], 0, 1)).toEqual([1]);
    expect(insertAt()).toEqual([]);
  });
});
