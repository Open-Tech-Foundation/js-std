import { difference } from '../../src';

describe('Array', () => {
  test('difference', () => {
    expect(difference()).toEqual([]);

    expect(difference([])).toEqual([]);

    expect(difference([[undefined], []])).toEqual([undefined]);

    expect(difference([[undefined], [undefined]])).toEqual([]);

    expect(difference([[undefined, null], [undefined]])).toEqual([null]);

    expect(difference([[1], []])).toEqual([1]);

    expect(difference([[1], [1]])).toEqual([]);

    expect(difference([[1], [1, 2]])).toEqual([]);

    expect(difference([[1, 2, 3, 4, 5], [2, 3], [4]])).toEqual([1, 5]);

    expect(
      difference([
        [1, 2],
        [1, 2],
      ]),
    ).toEqual([]);

    expect(
      difference([
        [1, 2, 3],
        [1, 2],
      ]),
    ).toEqual([3]);

    expect(
      difference([
        [1, 2, 3, 4],
        [1, 2],
      ]),
    ).toEqual([3, 4]);

    expect(
      difference([
        [1, 'a'],
        [1, 2],
      ]),
    ).toEqual(['a']);

    expect(
      difference([
        [1, 'a', 5.0],
        [1, 2],
      ]),
    ).toEqual(['a', 5.0]);

    expect(difference([[-0], [0]])).toEqual([-0]);

    expect(difference([[[]], [[]]])).toEqual([]);

    expect(difference([[{ a: 1 }], [{ a: 1 }]])).toEqual([]);

    expect(difference([[{ a: 1 }], [{ a: 1 }, { a: 2 }]])).toEqual([]);

    expect(
      difference([
        [{ a: 1 }, { a: 3 }],
        [{ a: 1 }, { a: 2 }],
      ]),
    ).toEqual([{ a: 3 }]);
    expect(
      difference(
        [
          ['Apple', 'mango', 'orange'],
          ['mango', 'apple'],
        ],
        (f) => f.toLowerCase(),
      ),
    ).toEqual(['orange']);
  });

  const odds = [1, 3, 5, 7, 9];
  const squares = [1, 4, 9];
  expect(difference([odds, squares])).toEqual([3, 5, 7]);

  expect(
    difference(
      [
        [2.1, 1.2],
        [2.3, 3.4],
      ],
      Math.floor,
    ),
  ).toEqual([1.2]);

  expect(
    difference([
      [2, 1, 2],
      [2, 2, 3],
    ]),
  ).toEqual([1]);
});
