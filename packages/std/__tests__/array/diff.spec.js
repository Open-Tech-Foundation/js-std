import { diff } from '../../src';

describe('Array', () => {
  test('diff', () => {
    expect(diff()).toEqual([]);

    expect(diff([])).toEqual([]);

    expect(diff([[undefined], []])).toEqual([undefined]);

    expect(diff([[undefined], [undefined]])).toEqual([]);

    expect(diff([[undefined, null], [undefined]])).toEqual([null]);

    expect(diff([[1], []])).toEqual([1]);

    expect(diff([[1], [1]])).toEqual([]);

    expect(diff([[1], [1, 2]])).toEqual([]);

    expect(diff([[1, 2, 3, 4, 5], [2, 3], [4]])).toEqual([1, 5]);

    expect(
      diff([
        [1, 2],
        [1, 2],
      ])
    ).toEqual([]);

    expect(
      diff([
        [1, 2, 3],
        [1, 2],
      ])
    ).toEqual([3]);

    expect(
      diff([
        [1, 2, 3, 4],
        [1, 2],
      ])
    ).toEqual([3, 4]);

    expect(
      diff([
        [1, 'a'],
        [1, 2],
      ])
    ).toEqual(['a']);

    expect(
      diff([
        [1, 'a', 5.0],
        [1, 2],
      ])
    ).toEqual(['a', 5.0]);

    expect(diff([[-0], [0]])).toEqual([-0]);

    expect(diff([[[]], [[]]])).toEqual([]);

    expect(diff([[{ a: 1 }], [{ a: 1 }]])).toEqual([]);

    expect(diff([[{ a: 1 }], [{ a: 1 }, { a: 2 }]])).toEqual([]);

    expect(
      diff([
        [{ a: 1 }, { a: 3 }],
        [{ a: 1 }, { a: 2 }],
      ])
    ).toEqual([{ a: 3 }]);
    expect(
      diff(
        [
          ['Apple', 'mango', 'orange'],
          ['mango', 'apple'],
        ],
        (f) => f.toLowerCase()
      )
    ).toEqual(['orange']);
  });

  const odds = [1, 3, 5, 7, 9];
  const squares = [1, 4, 9];
  expect(diff([odds, squares])).toEqual([3, 5, 7]);

  expect(
    diff(
      [
        [2.1, 1.2],
        [2.3, 3.4],
      ],
      Math.floor
    )
  ).toEqual([1.2]);

  expect(
    diff([
      [2, 1, 2],
      [2, 2, 3],
    ])
  ).toEqual([1]);
});
