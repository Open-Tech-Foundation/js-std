import { replaceAt } from '../../src';

describe('Array', () => {
  test('replaceAt', () => {
    expect(replaceAt([1, 2, 3], 1, 5)).toEqual([1, 5, 3]);
    expect(replaceAt([1, 2, 3], 1, 5, 6)).toEqual([1, 5, 6, 3]);
    expect(replaceAt([1, 2, 3], 0, 0)).toEqual([0, 2, 3]);
    expect(replaceAt([1, 2, 3], 2, 4)).toEqual([1, 2, 4]);
    expect(replaceAt([], 0, 1)).toEqual([1]);
    expect(replaceAt()).toEqual([]);
  });
});
