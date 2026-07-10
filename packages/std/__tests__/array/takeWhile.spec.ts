import { takeWhile } from '../../src';

describe('Array > takeWhile', () => {
  test('takes while predicate is true', () => {
    expect(takeWhile([1, 2, 3, 4, 5], (n) => n < 4)).toEqual([1, 2, 3]);
    expect(takeWhile([1, 2, 3], (n) => n > 3)).toEqual([]);
  });

  test('takes while from right', () => {
    expect(takeWhile([1, 2, 3, 4, 5], (n) => n > 3, true)).toEqual([4, 5]);
    expect(takeWhile([1, 2, 3], (n) => n < 3, true)).toEqual([]);
  });

  test('uses index and array params', () => {
    expect(takeWhile([1, 2, 3, 4, 5], (_, i) => i < 3)).toEqual([1, 2, 3]);
  });

  test('preserves original index and array params from right', () => {
    expect(
      takeWhile([10, 20, 30, 40], (_, i, arr) => i >= arr.length - 2, true),
    ).toEqual([30, 40]);
    expect(takeWhile([1, 2, 3, 4], (_, i) => i >= 2, true)).toEqual([3, 4]);
  });
});
