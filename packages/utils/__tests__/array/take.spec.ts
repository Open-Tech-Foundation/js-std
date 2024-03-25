import { take } from '../../src';

describe('Array > take', () => {
  test('throws error if limit is negative', () => {
    expect(() => take([1, 2, 3], -1)).toThrowError();
  });

  test('throws error if limit is float', () => {
    expect(() => take([1, 2, 3], 1.1)).toThrowError();
  });

  test('returns empty if limit is 0', () => {
    expect(take([1, 2, 3], 0)).toEqual([]);
  });

  test('takes a value', () => {
    expect(take([1, 2, 3])).toEqual([1]);
    expect(take([1, 2, 3], 1)).toEqual([1]);
  });

  test('takes multiple values', () => {
    expect(take([1, 2, 3], 2)).toEqual([1, 2]);
    expect(take([1, 2, 3, 4, 5], 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('returns all items if limit > length', () => {
    expect(take([1, 2, 3, 4, 5], 6)).toEqual([1, 2, 3, 4, 5]);
  });

  test('null limit retuns all items', () => {
    expect(take([1, 2, 3, 4, 5], null)).toEqual([1, 2, 3, 4, 5]);
  });

  test('returns only items if cb passed', () => {
    expect(take([1, 2, 3, 4, 5], 2, (val) => val % 2 === 0)).toEqual([2, 4]);
    expect(take([1, 2, 3, 4, 5], 3, (val) => val % 2 !== 0)).toEqual([1, 3, 5]);

    const users = [
      { name: 'x', active: false },
      { name: 'y', active: true },
      { name: 'z', active: false },
    ];
    expect(take(users, null, (val) => val.active)).toEqual([
      { name: 'y', active: true },
    ]);
  });
});
