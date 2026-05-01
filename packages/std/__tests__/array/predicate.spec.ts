import { takeWhile, dropWhile, chunkWhile, partition } from '../../src';

describe('Array', () => {
  test('takeWhile', () => {
    expect(takeWhile()).toEqual([]);
    expect(takeWhile([])).toEqual([]);
    expect(takeWhile([1, 2, 3, 4, 5], (n) => n < 4)).toEqual([1, 2, 3]);
    expect(takeWhile([1, 2, 3], (n) => n > 3)).toEqual([]);
    expect(takeWhile([1, 2, 3], (n) => n < 10)).toEqual([1, 2, 3]);
    expect(takeWhile([true, true, false, true], Boolean)).toEqual([
      true,
      true,
    ]);
    expect(
      takeWhile(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        (item) => item.a < 3,
      ),
    ).toEqual([{ a: 1 }, { a: 2 }]);
    expect(takeWhile([1, 2, 3, 4, 5], (_, i) => i < 3)).toEqual([1, 2, 3]);
  });

  test('dropWhile', () => {
    expect(dropWhile()).toEqual([]);
    expect(dropWhile([])).toEqual([]);
    expect(dropWhile([1, 2, 3, 4, 5], (n) => n < 3)).toEqual([3, 4, 5]);
    expect(dropWhile([1, 2, 3], (n) => n > 3)).toEqual([1, 2, 3]);
    expect(dropWhile([1, 2, 3], (n) => n < 10)).toEqual([]);
    expect(dropWhile([false, false, true, false], (v) => !v)).toEqual([
      true,
      false,
    ]);
    expect(
      dropWhile(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        (item) => item.a < 2,
      ),
    ).toEqual([{ a: 2 }, { a: 3 }]);
    expect(dropWhile([1, 2, 3, 4, 5], (_, i) => i < 2)).toEqual([3, 4, 5]);
  });

  test('chunkWhile', () => {
    expect(chunkWhile()).toEqual([]);
    expect(chunkWhile([])).toEqual([]);
    expect(chunkWhile([1], () => true)).toEqual([[1]]);
    expect(chunkWhile([1, 2, 3, 4, 5], (a, b) => b - a === 1)).toEqual([
      [1, 2, 3, 4, 5],
    ]);
    expect(chunkWhile([1, 2, 4, 5, 7], (a, b) => b - a < 2)).toEqual([
      [1, 2],
      [4, 5],
      [7],
    ]);
    expect(chunkWhile([1, 1, 2, 3, 5, 5, 6], (a, b) => a === b)).toEqual([
      [1, 1],
      [2],
      [3],
      [5, 5],
      [6],
    ]);
    expect(chunkWhile([1, 3, 5], () => false)).toEqual([[1], [3], [5]]);
    expect(chunkWhile([1, 2, 3], (a, b, i, arr) => arr[i] === a)).toEqual([
      [1],
      [2],
      [3],
    ]);
  });

  test('partition', () => {
    expect(partition()).toEqual([[], []]);
    expect(partition([])).toEqual([[], []]);
    expect(partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)).toEqual([
      [2, 4],
      [1, 3, 5],
    ]);
    expect(partition([0, 1, false, 2, '', 3], Boolean)).toEqual([
      [1, 2, 3],
      [0, false, ''],
    ]);
    expect(partition([1, 2, 3], () => true)).toEqual([[1, 2, 3], []]);
    expect(partition([1, 2, 3], () => false)).toEqual([[], [1, 2, 3]]);
    expect(
      partition(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        (item) => item.a > 1,
      ),
    ).toEqual([[{ a: 2 }, { a: 3 }], [{ a: 1 }]]);
    expect(partition([1, 2, 3, 4], (_, i) => i % 2 === 0)).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });
});
