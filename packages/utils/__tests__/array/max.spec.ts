import { max } from '../../src';

describe('Array > max', () => {
  test('empty array', () => {
    expect(max([])).toBe(null);
  });

  test('falsy array', () => {
    expect(max([undefined, null])).toBe(null);
    expect(max([1, undefined, 2, null, 3])).toBe(3);
  });

  test('number array', () => {
    expect(max([1, 2, 3, 4, 5])).toBe(5);
    expect(max([10, 21, 37, 14, 15])).toBe(37);
    expect(max([100.12, 100.21, 37.52, 14.17, 15.26])).toBe(100.21);
  });

  test('string array', () => {
    expect(max(['a', 'b', 'c', 'z', 'd'])).toBe('z');
    expect(max(['apple', 'mango', 'grapes'])).toBe('mango');
  });

  test('array of objects', () => {
    const arr = [
      {
        name: 'x',
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
    expect(max(arr, (f) => f.age)).toEqual({
      name: 'y',
      age: 16,
    });
  });
});
