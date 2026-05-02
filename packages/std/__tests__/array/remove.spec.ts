import { remove } from '../../src';

describe('Array', () => {
  test('remove', () => {
    expect(remove([1, 2, 3], 1)).toEqual([1, 3]);
    expect(remove([1, 2, 3, 4], 1, 2)).toEqual([1, 4]);
    expect(remove([1, 2, 3], 0)).toEqual([2, 3]);
    expect(remove([1, 2, 3], 2)).toEqual([1, 2]);
    expect(remove([], 0)).toEqual([]);
    expect(remove()).toEqual([]);

    // Predicate-based remove
    expect(remove([1, 2, 3, 4, 5], (x) => x % 2 === 0)).toEqual([1, 3, 5]);
  });
});
