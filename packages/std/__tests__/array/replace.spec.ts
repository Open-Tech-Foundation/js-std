import { replace } from '../../src';

describe('Array', () => {
  test('replace', () => {
    expect(replace([1, 2, 3], 1, 5)).toEqual([1, 5, 3]);
    expect(replace([1, 2, 3], 1, 5, 6)).toEqual([1, 5, 6, 3]);
    expect(replace([1, 2, 3], 0, 0)).toEqual([0, 2, 3]);
    expect(replace([1, 2, 3], 2, 4)).toEqual([1, 2, 4]);
    expect(replace([], 0, 1)).toEqual([1]);
    expect(replace()).toEqual([]);

    // Predicate-based replace
    expect(replace([1, 2, 3, 4, 5], (x) => x % 2 === 0, 0)).toEqual([
      1, 0, 3, 0, 5,
    ]);
  });
});
