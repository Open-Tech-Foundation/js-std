import { arrReplace } from '../../src';

describe('Array', () => {
  test('arrReplace', () => {
    expect(arrReplace()).toEqual([]);
    expect(arrReplace([])).toEqual([]);
    expect(arrReplace([1])).toEqual([1]);
    expect(arrReplace([1, 2, 3], null, 'a')).toEqual([1, 2, 'a']);
    expect(arrReplace([1, 2, 3], 0, 'a')).toEqual(['a', 2, 3]);
    expect(arrReplace([1, 2, 3], 1, 'a', 'b')).toEqual([1, 'a', 'b']);
    expect(arrReplace([1, 2, 3], 3, 'c')).toEqual([1, 2, 3, 'c']);
    expect(arrReplace([1, 2, 3], 5, 'c', 'd')).toEqual([1, 2, 3, 'c', 'd']);
  });
});
