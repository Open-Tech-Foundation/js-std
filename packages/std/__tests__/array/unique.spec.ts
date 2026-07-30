import { toArrayIter, unique, uniqueIter } from '../../src';

describe('Array > unique', () => {
  test('compares the same way with an identity iteratee as without one', () => {
    // The iteratee derives the key; it must not change how two keys are
    // compared. This used to switch from `Set` to `isEql` and disagree with
    // itself, so `unique([0, -0], (x) => x)` kept both.
    const inputs: unknown[][] = [
      [0, -0],
      [Number.NaN, Number.NaN],
      [1, '1', 1],
      ['a', 'A', 'a'],
      [{ a: 1 }, { a: 1 }],
      [
        [1, 2],
        [1, 2],
      ],
      [null, undefined, null],
      [1, { a: 1 }, 1, { a: 1 }],
    ];

    for (const input of inputs) {
      expect(unique(input, (x) => x)).toEqual(unique(input));
    }
  });

  test('matches primitives by identity', () => {
    expect(unique([0, -0])).toEqual([0]);
    expect(unique([0, -0], (x) => x)).toEqual([0]);
    expect(unique([Number.NaN, Number.NaN])).toEqual([Number.NaN]);
    expect(unique([Number.NaN, Number.NaN], (x) => x)).toEqual([Number.NaN]);
  });

  test('agrees with uniqueIter', () => {
    const inputs: unknown[][] = [
      [0, -0],
      [1, 2, 2, 3],
      [{ a: 1 }, { a: 1 }, { a: 2 }],
      ['a', 'A', 'b'],
      [1, { a: 1 }, 1, { a: 1 }],
    ];

    for (const input of inputs) {
      expect(unique(input)).toEqual(toArrayIter(uniqueIter(input)));
      expect(unique(input, (x) => x)).toEqual(
        toArrayIter(uniqueIter(input, (x) => x)),
      );
    }
  });

  test('invokes the iteratee once per element', () => {
    // It used to re-derive the key of every element already kept, on every
    // element — quadratic calls into user code.
    let calls = 0;
    const arr = [1, 2, 3, 4, 5, 1, 2, 3];

    unique(arr, (n) => {
      calls++;
      return n;
    });

    expect(calls).toBe(arr.length);
  });

  test('invalid cases', () => {
    expect(unique()).toEqual([]);
    expect(unique([])).toEqual([]);
  });

  test('array of numbers', () => {
    let a = [1, 2, 3, 4, 5];
    expect(unique(a)).toEqual([1, 2, 3, 4, 5]);

    a = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];
    expect(unique(a)).toEqual([1, 2, 3, 4, 5]);

    a = [2.1, 1.2, 2.3];
    expect(unique(a, Math.floor)).toEqual([2.1, 1.2]);

    a = [-1, -5, 2, 10, 1, 2];
    expect(unique(a, Math.abs)).toEqual([-1, -5, 2, 10]);
  });

  test('array of strings', () => {
    let a = ['a', 'A', 'b', 'B', 'c'];
    expect(unique(a)).toEqual(['a', 'A', 'b', 'B', 'c']);

    a = ['a', 'A', 'b', 'B', 'c'];
    expect(unique(a, (val) => val.toLowerCase())).toEqual(['a', 'b', 'c']);
  });

  test('array of objects', () => {
    const fish = [
      {
        name: 'Marlin',
        weight: 105,
        source: 'ocean',
      },
      {
        name: 'Salmon',
        weight: 22,
        source: 'river',
      },
      {
        name: 'Salmon',
        weight: 22,
        source: 'river',
      },
    ];

    expect(unique(fish)).toEqual([
      { name: 'Marlin', weight: 105, source: 'ocean' },
      { name: 'Salmon', weight: 22, source: 'river' },
    ]);
  });

  test('mixed values', () => {
    const users = [
      { id: 1, name: 'john' },
      { id: 2, name: 'john' },
      { id: 2, name: 'john' },
    ];
    const a = [
      1,
      '1',
      1,
      'a',
      'z',
      3,
      [1, 2, 3],
      { a: 1, users },
      1,
      'a',
      4.5,
      true,
      'z',
      { a: 1, users },
      3,
      [1, 2, 3],
    ];
    expect(unique(a)).toEqual([
      1,
      '1',
      'a',
      'z',
      3,
      [1, 2, 3],
      { a: 1, users },
      4.5,
      true,
    ]);
  });
});
