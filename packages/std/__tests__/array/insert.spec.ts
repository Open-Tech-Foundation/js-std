import { insert } from '../../src';

describe('Array', () => {
  test('insert', () => {
    expect(insert([1, 2, 3], 1, 5)).toEqual([1, 5, 2, 3]);
    expect(insert([1, 2, 3], 0, 5, 6)).toEqual([5, 6, 1, 2, 3]);
    expect(insert([1, 2, 3], 3, 4)).toEqual([1, 2, 3, 4]);
    expect(insert([], 0, 1)).toEqual([1]);
    expect(insert()).toEqual([]);

    // Predicate-based insert
    expect(insert([1, 2, 3], (x) => x === 2, 5)).toEqual([1, 5, 2, 3]);
    expect(insert([1, 2, 3], (x) => x === 2, 5, 'after')).toEqual([1, 2, 5, 3]);
  });
});
