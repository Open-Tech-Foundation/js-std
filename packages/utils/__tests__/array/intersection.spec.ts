import { intersection } from '../../src';

describe('Array > intersection', () => {
  test('two sets', () => {
    const setA = new Set([1, 2, 3, 4]);
    const setB = new Set([2, 3]);
    expect(intersection(setA, setB)).toEqual(new Set([2, 3]));
  });

  test('multiple sets', () => {
    const setA = new Set([1, 2, 3, 4]);
    const setB = new Set([2, 3]);
    const setC = new Set([3, 4, 5, 6]);
    expect(intersection(setA, setB, setC)).toEqual(new Set([3]));
  });

  test('two arrays', () => {
    const setA = [1, 2];
    const setB = [2, 3];
    expect(intersection(setA, setB)).toEqual([2]);
  });

  test('two arrays with duplicate values', () => {
    const setA = [1, 2, 1, 2, 1, 1, 2];
    const setB = [2, 3, 3, 2, 3];
    expect(intersection(setA, setB)).toEqual([2]);
  });

  test('Mix array & set values with duplicate values', () => {
    const setA = [1, 2, 1, 2, 1, 1, 2];
    const setB = new Set([2, 3, 3, 2, 3]);
    expect(intersection(setA, setB)).toEqual([2]);
  });

  test('multiple arrays', () => {
    const arrays = [
      [1, 2, 3],
      [101, 2, 1, 10],
      [2, 1],
    ];
    expect(intersection(...arrays)).toEqual([2, 1]);

    const arrays2 = [[1, 2, 3], [101, 2, 1, 10], [2, 1], [1]];
    expect(intersection(...arrays2)).toEqual([1]);
  });
});
