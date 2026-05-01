import { unique } from '../../src';

describe('Array > unique', () => {
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
