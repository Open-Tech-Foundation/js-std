import { dropWhile } from '../../src';

describe('Array > dropWhile', () => {
  test('drops while predicate is true', () => {
    expect(dropWhile([1, 2, 3, 4, 5], (n) => n < 3)).toEqual([3, 4, 5]);
    expect(dropWhile([1, 2, 3], (n) => n > 3)).toEqual([1, 2, 3]);
  });

  test('drops while from right', () => {
    expect(dropWhile([1, 2, 3, 4, 5], (n) => n > 3, true)).toEqual([1, 2, 3]);
    expect(dropWhile([1, 2, 3], (n) => n < 3, true)).toEqual([1, 2, 3]);
  });

  test('uses index and array params', () => {
    expect(dropWhile([1, 2, 3, 4, 5], (_, i) => i < 2)).toEqual([3, 4, 5]);
  });
});
