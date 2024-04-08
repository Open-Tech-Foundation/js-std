import { reverse } from '../../src';

describe('Array > reverse', () => {
  test('empty array', () => {
    expect(reverse()).toEqual([]);
    expect(reverse([])).toEqual([]);
  });

  test('array of numbers', () => {
    expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
  });

  test('array of objects', () => {
    expect(reverse([{ a: 1 }, { b: 2 }, { c: 3 }])).toEqual([
      {
        c: 3,
      },
      {
        b: 2,
      },
      {
        a: 1,
      },
    ]);
  });

  test('strings', () => {
    expect(reverse('Apple')).toEqual(['e', 'l', 'p', 'p', 'A']);
  });

  test('sparse array', () => {
    expect(reverse([1, , 3])).toStrictEqual([3, undefined, 1]);
  });
});
