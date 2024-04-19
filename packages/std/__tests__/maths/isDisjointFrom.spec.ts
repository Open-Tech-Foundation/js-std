import { isDisjointFrom } from '../../src';

describe('Maths > isDisjointFrom', () => {
  test('truthy', () => {
    expect(isDisjointFrom([1, 3, 5], [2, 4])).toBe(true);
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
    const squares = new Set([1, 4, 9, 16]);
    expect(isDisjointFrom(primes, squares)).toBe(true);
  });

  test('falsy', () => {
    expect(isDisjointFrom([1, 2, 3, 5], [2, 4])).toBe(false);
    const composites = new Set([4, 6, 8, 9, 10, 12, 14, 15, 16, 18]);
    const squares = new Set([1, 4, 9, 16]);
    expect(isDisjointFrom(composites, squares)).toBe(false);
  });
});
