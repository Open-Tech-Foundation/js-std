import { min } from '../../src';

describe('Array > min', () => {
  test('empty array', () => {
    expect(min([])).toBe(null);
  });

  test('falsy array', () => {
    expect(min([undefined, null])).toBe(null);
    expect(min([1, undefined, 2, null, 3])).toBe(1);
  });

  test('number array', () => {
    expect(min([1, 2, -3, 4, 5])).toBe(-3);
    expect(min([10, 21, 37, 14, 15])).toBe(10);
    expect(min([100.12, 100.21, 37.52, 14.17, 15.26])).toBe(14.17);
  });

  test('string array', () => {
    expect(min(['a', 'b', 'c', 'z', 'd'])).toBe('a');
    expect(min(['apple', 'mango', 'grapes'])).toBe('apple');
  });

  test('array of objects', () => {
    const arr = [
      {
        name: 'x',
        age: 10,
      },
      {
        name: 'x2',
        age: 10,
      },
      {
        name: 'y',
        age: 16,
      },
      {
        name: 'z',
        age: 13,
      },
      { name: 'y2', age: 16 },
    ];
    expect(min(arr, (f) => f.age)).toEqual({
      name: 'x',
      age: 10,
    });
  });
});
