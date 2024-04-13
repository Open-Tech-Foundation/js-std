import { arrReplace } from '../../src';

describe('Array', () => {
  test('arrReplace', () => {
    expect(arrReplace()).toEqual([]);
    expect(arrReplace([])).toEqual([]);
    expect(arrReplace([1])).toEqual([1]);
    expect(arrReplace([1, 2, 3], null, null, 'a')).toEqual([1, 2, 'a']);
    expect(arrReplace([1, 2, 3], 0, null, 'a')).toEqual(['a', 2, 3]);
    expect(arrReplace([1, 2, 3], 1, null, 'a', 'b')).toEqual([1, 'a', 'b']);
    expect(arrReplace([1, 2, 3], 3, null, 'c')).toEqual([1, 2, 3, 'c']);
    expect(arrReplace([1, 2, 3], 5, null, 'c', 'd')).toEqual([
      1,
      2,
      3,
      'c',
      'd',
    ]);

    const months = ['Jan', 'Feb', 'Apr', 'May'];
    expect(arrReplace(months, 1, 1, 'Feb', 'Mar')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
    ]);
    expect(arrReplace(months, 1, null, 'Feb', 'Mar')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'May',
    ]);
  });
});
