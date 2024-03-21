import { bounds } from '../../src';

describe('Array > bounds', () => {
  test('empty array', () => {
    expect(bounds([])).toBe(null);
  });

  test('falsy array', () => {
    expect(bounds([undefined, null])).toBe(null);
    expect(bounds([1, undefined, 2, null, 3])).toEqual([1, 3]);
  });

  test('number array', () => {
    expect(bounds([1, 2, 3, 4, 5])).toEqual([1, 5]);
    expect(bounds([10, 21, 37, 14, 15])).toEqual([10, 37]);
    expect(bounds([100.12, 100.21, 37.52, 14.17, 15.26])).toEqual([
      14.17, 100.21,
    ]);
  });

  test('string array', () => {
    expect(bounds(['a', 'b', 'c', 'z', 'd'])).toEqual(['a', 'z']);
    expect(bounds(['apple', 'mango', 'grapes'])).toEqual(['apple', 'mango']);
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
    expect(bounds(arr, (f) => f.age)).toEqual([
      {
        name: 'x',
        age: 10,
      },
      {
        name: 'y',
        age: 16,
      },
    ]);
  });
});
