import { intersection } from '../../src';

describe('Array > intersection', () => {
  test('two arrays', () => {
    const setA = [1, 2];
    const setB = [2, 3];
    expect(intersection([setA, setB])).toEqual([2]);

    const odds = [1, 3, 5, 7, 9];
    const squares = [1, 4, 9];
    expect(intersection([odds, squares])).toEqual([1, 9]);

    expect(
      intersection(
        [
          [2.1, 1.2],
          [2.3, 3.4],
        ],
        Math.floor
      )
    ).toEqual([2.1]);
  });

  test('two arrays with duplicate values', () => {
    const setA = [1, 2, 1, 2, 1, 1, 2];
    const setB = [2, 3, 3, 2, 3];
    expect(intersection([setA, setB])).toEqual([2]);
  });

  test('multiple arrays', () => {
    const arrays = [
      [1, 2, 3],
      [101, 2, 1, 10],
      [2, 1],
    ];
    expect(intersection([...arrays])).toEqual([1, 2]);

    const arrays2 = [[1, 2, 3], [101, 2, 1, 10], [2, 1], [1]];
    expect(intersection([...arrays2])).toEqual([1]);
  });

  test('multiple arrays with objects', () => {
    const arrays = [
      [1, 2, { a: 1 }],
      [101, 2, { a: 1 }, 10],
      [{ a: 1 }, 2, 1],
    ];
    expect(intersection([...arrays])).toEqual([2, { a: 1 }]);
  });
});
