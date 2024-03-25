import { drop } from '../../src';

describe('Array > drop', () => {
  test('throws error if limit is negative', () => {
    expect(() => drop([1, 2, 3], -1)).toThrowError();
  });

  test('throws error if limit is float', () => {
    expect(() => drop([1, 2, 3], 1.1)).toThrowError();
  });

  test('returns all if limit is 0', () => {
    expect(drop([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });

  test('drops a value', () => {
    expect(drop([1, 2, 3])).toEqual([2, 3]);
    expect(drop([1, 2, 3], 1)).toEqual([2, 3]);
  });

  test('drops multiple values', () => {
    expect(drop([1, 2, 3], 2)).toEqual([3]);
    expect(drop([1, 2, 3, 4, 5], 5)).toEqual([]);
  });

  test('drops all items if limit > length', () => {
    expect(drop([1, 2, 3, 4, 5], 6)).toEqual([]);
  });

  test('null limit drops all items', () => {
    expect(drop([1, 2, 3, 4, 5], null)).toEqual([]);
  });

  test('drops only items if cb passed', () => {
    expect(drop([1, 2, 3, 4, 5], 2, (val) => val % 2 === 0)).toEqual([1, 3, 5]);
    expect(drop([1, 2, 3, 4, 5], 3, (val) => val % 2 !== 0)).toEqual([2, 4]);

    const users = [
      { name: 'x', active: false },
      { name: 'y', active: true },
      { name: 'z', active: false },
    ];
    expect(drop(users, null, (val) => val.active)).toEqual([
      { name: 'x', active: false },
      { name: 'z', active: false },
    ]);
  });
});
