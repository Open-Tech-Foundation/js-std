import { isSupersetOf } from '../../src';

describe('Maths > isSupersetOf', () => {
  test('truthy', () => {
    const a = [1, 2, 3];
    expect(isSupersetOf(a, [])).toBe(true);
    expect(isSupersetOf(a, [1])).toBe(true);
    expect(isSupersetOf(a, [1, 2])).toBe(true);
    expect(isSupersetOf(a, [1, 2, 3])).toBe(true);

    const evens = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    const fours = new Set([4, 8, 12, 16]);
    expect(isSupersetOf(evens, fours)).toBe(true);

    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    expect(isSupersetOf(set1, set2)).toBe(true);
  });

  test('falsy', () => {
    const a = [1, 2, 3, 4];
    expect(isSupersetOf(a, [1, 2, 3, 4, 5])).toBe(false);

    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
    const odds = new Set([3, 5, 7, 9, 11, 13, 15, 17, 19]);
    expect(isSupersetOf(primes, odds)).toBe(false);
  });

  test('improper', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    expect(isSupersetOf(set1, set2)).toBe(true);
    expect(isSupersetOf(set1, set2, false)).toBe(true);
    expect(isSupersetOf(set1, set2, true)).toBe(false);
  });

  test('proper', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 3, 4, 5]);
    expect(isSupersetOf(set1, set2, true)).toBe(false);
    expect(isSupersetOf(set3, set1, false)).toBe(true);
    expect(isSupersetOf(set3, set2, true)).toBe(true);
  });
});
