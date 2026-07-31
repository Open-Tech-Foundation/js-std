import { binarySearch } from '../../src';

describe('Array > binarySearch', () => {
  test('finds a value in a sorted array', () => {
    const arr = [1, 3, 5, 7, 9];

    expect(binarySearch(arr, 1)).toBe(0);
    expect(binarySearch(arr, 5)).toBe(2);
    expect(binarySearch(arr, 9)).toBe(4);
  });

  test('returns -1 when the value is absent', () => {
    const arr = [1, 3, 5, 7, 9];

    expect(binarySearch(arr, 0)).toBe(-1);
    expect(binarySearch(arr, 4)).toBe(-1);
    expect(binarySearch(arr, 10)).toBe(-1);
  });

  test('handles an empty and a single-element array', () => {
    expect(binarySearch([], 1)).toBe(-1);
    expect(binarySearch(undefined, 1)).toBe(-1);
    expect(binarySearch([1], 1)).toBe(0);
    expect(binarySearch([1], 2)).toBe(-1);
  });

  test('searches strings with the default comparator', () => {
    const arr = ['ant', 'bee', 'cow', 'dog'];

    expect(binarySearch(arr, 'cow')).toBe(2);
    expect(binarySearch(arr, 'cat')).toBe(-1);
  });

  test('returns the first of several equal values', () => {
    const arr = [1, 2, 2, 2, 2, 3];

    expect(binarySearch(arr, 2)).toBe(1);
  });

  test('returns the first match however the search lands', () => {
    // A run at every position, so no single midpoint choice can pass by luck.
    for (let start = 0; start < 8; start++) {
      const arr = [
        ...Array.from({ length: start }, (_, i) => i - 100),
        ...Array(4).fill(0),
        ...Array.from({ length: 8 - start }, (_, i) => i + 100),
      ];

      expect(binarySearch(arr, 0)).toBe(start);
    }
  });

  test('takes a comparator, which decides what counts as a match', () => {
    const byLength = (a: string, b: string) => a.length - b.length;

    expect(binarySearch(['a', 'bb', 'ccc'], 'dd', byLength)).toBe(1);
    expect(binarySearch(['a', 'bb', 'ccc'], 'dddd', byLength)).toBe(-1);
  });

  test('searches a descending array with the matching comparator', () => {
    const desc = (a: number, b: number) => b - a;

    expect(binarySearch([7, 5, 3, 1], 5, desc)).toBe(1);
    expect(binarySearch([7, 5, 3, 1], 7, desc)).toBe(0);
    expect(binarySearch([7, 5, 3, 1], 4, desc)).toBe(-1);
  });

  test('searches objects by a key', () => {
    const users = [{ id: 1 }, { id: 4 }, { id: 9 }];
    const byId = (a: { id: number }, b: { id: number }) => a.id - b.id;

    expect(binarySearch(users, { id: 4 }, byId)).toBe(1);
    expect(binarySearch(users, { id: 5 }, byId)).toBe(-1);
  });

  test('agrees with indexOf across every position of many arrays', () => {
    for (let len = 0; len <= 33; len++) {
      const arr = Array.from({ length: len }, (_, i) => i * 2);

      for (let target = -1; target <= len * 2 + 1; target++) {
        expect(binarySearch(arr, target)).toBe(arr.indexOf(target));
      }
    }
  });

  test('agrees with indexOf on arrays holding duplicates', () => {
    for (let seed = 0; seed < 60; seed++) {
      const arr = Array.from({ length: 20 }, (_, i) =>
        Math.floor((i + seed) / 3),
      ).sort((a, b) => a - b);

      for (let target = -1; target <= 10; target++) {
        expect(binarySearch(arr, target)).toBe(arr.indexOf(target));
      }
    }
  });

  test('does not scan the array', () => {
    let comparisons = 0;
    const arr = Array.from({ length: 1024 }, (_, i) => i);

    binarySearch(arr, 999, (a, b) => {
      comparisons++;
      return a - b;
    });

    // A scan would be 1024. log2(1024) is 10, plus the one confirming the hit.
    expect(comparisons).toBeLessThanOrEqual(12);
  });
});
