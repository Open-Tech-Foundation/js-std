import { isSubsetOf } from '../../src';

describe('Maths > isSubsetOf', () => {
  test('truthy', () => {
    const a = [1, 2, 3, 4];
    expect(isSubsetOf([], a)).toBe(true);
    expect(isSubsetOf([1], a)).toBe(true);
    expect(isSubsetOf([1, 2], a)).toBe(true);
    expect(isSubsetOf([1, 2, 3], a)).toBe(true);
    expect(isSubsetOf([1, 2, 3, 4], a)).toBe(true);

    const fours = new Set([4, 8, 12, 16]);
    const evens = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    expect(isSubsetOf(fours, evens)).toBe(true);

    const setA = new Set([2, 4, 6]);
    expect(isSubsetOf([], setA)).toBe(true);
    expect(isSubsetOf([2], setA)).toBe(true);
    expect(isSubsetOf([4], setA)).toBe(true);
    expect(isSubsetOf([6], setA)).toBe(true);
    expect(isSubsetOf([2, 4], setA)).toBe(true);
    expect(isSubsetOf([2, 6], setA)).toBe(true);
    expect(isSubsetOf([2, 4, 6], setA)).toBe(true);
  });

  test('falsy', () => {
    const a = [1, 2, 3, 4];
    expect(isSubsetOf([1, 2, 3, 4, 5], a)).toBe(false);

    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
    const odds = new Set([3, 5, 7, 9, 11, 13, 15, 17, 19]);
    expect(isSubsetOf(primes, odds)).toBe(false);
  });

  test('improper', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    expect(isSubsetOf(set1, set2)).toBe(true);
    expect(isSubsetOf(set1, set2, false)).toBe(true);
    expect(isSubsetOf(set1, set2, true)).toBe(false);
  });

  test('proper', () => {
    let setA = new Set([2, 4, 6]);
    expect(isSubsetOf([], setA, true)).toBe(true);
    expect(isSubsetOf([2], setA, true)).toBe(true);
    expect(isSubsetOf([4], setA, true)).toBe(true);
    expect(isSubsetOf([6], setA, true)).toBe(true);
    expect(isSubsetOf([2, 4], setA, true)).toBe(true);
    expect(isSubsetOf([2, 6], setA, true)).toBe(true);
    expect(isSubsetOf([4, 6], setA, true)).toBe(true);
    expect(isSubsetOf([2, 4, 6], setA, true)).toBe(false);

    setA = new Set([12, 24]);
    const setB = new Set([36, 12, 24]);
    expect(isSubsetOf(setA, setB, true)).toBe(true);

    expect(isSubsetOf([1, 2, 3], [1, 2, 3, 6], true)).toBe(true);
  });
});
