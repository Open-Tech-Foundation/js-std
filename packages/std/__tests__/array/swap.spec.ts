import { swap } from '../../src';

describe('Array > swap', () => {
  test('empty array', () => {
    expect(swap([], 0, 0)).toEqual([]);
  });

  test('immutable', () => {
    const arr = [1, 2, 3];
    expect(swap(arr, 1, 2)).toEqual([1, 3, 2]);
    expect(arr).toEqual([1, 2, 3]);
  });

  test('swap 0 index to 1', () => {
    expect(swap([], 0, 1)).toEqual([]);
    expect(swap([0], 0, 1)).toEqual([undefined, 0]);
    expect(swap([0, 1], 0, 1)).toEqual([1, 0]);
  });

  test('swap index > length', () => {
    expect(swap([1, 2, 3], 1, 5)).toEqual([1, undefined, 3, , , 2]);
  });

  test('array of objects', () => {
    const arr = [{ a: 1 }, { b: 'a' }, { c: [5] }];
    expect(swap(arr, 0, 2)).toEqual([
      {
        c: [5],
      },
      {
        b: 'a',
      },
      {
        a: 1,
      },
    ]);
  });
});
