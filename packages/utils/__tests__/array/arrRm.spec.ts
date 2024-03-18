import { arrRm } from '../../src';

describe('Array', () => {
  test('arrRm', () => {
    expect(arrRm()).toEqual([]);
    expect(arrRm([])).toEqual([]);
    expect(arrRm([1])).toEqual([]);
    expect(arrRm([1, 2])).toEqual([1]);
    expect(arrRm([1, 2], 1)).toEqual([1]);
    expect(arrRm([1, 2], 1, 1)).toEqual([1]);
    expect(arrRm([1, 2, 3, 4, 5], -1)).toEqual([1, 2, 3, 4]);
    expect(arrRm([1, 2, 3, 4, 5], -1, 1)).toEqual([1, 2, 3, 4]);
    expect(arrRm([1, 2, 3, 4, 5], -1, 3)).toEqual([1, 2, 3, 4]);
    expect(arrRm([1, 2, 3, 4, 5], -2, 2)).toEqual([1, 2, 3]);

    const a = ['a', 'b', 'c'];
    expect(arrRm(a)).toEqual(['a', 'b']);
    expect(a).toEqual(['a', 'b', 'c']);

    const myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
    expect(arrRm(myFish, 2, Infinity)).toEqual(['angel', 'clown']);
  });
});
