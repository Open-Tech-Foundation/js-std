import { shuffle } from '../../src';

describe('Array > shuffle', () => {
  test('empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  test('single element array', () => {
    expect(shuffle([1])).toEqual([1]);
  });

  test('array of numbers', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(shuffle(arr)).not.toEqual([1, 2, 3, 4, 5]);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
