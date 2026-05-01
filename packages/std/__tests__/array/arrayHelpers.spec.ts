import { flatMap, sample, unzip, zip } from '../../src';

describe('Array', () => {
  test('flatMap', () => {
    expect(flatMap()).toEqual([]);
    expect(flatMap([])).toEqual([]);
    expect(flatMap([1, 2], (x) => [x, x * 10])).toEqual([1, 10, 2, 20]);
    expect(flatMap([1, 2, 3], (x) => [x])).toEqual([1, 2, 3]);
    expect(flatMap([1], () => [])).toEqual([]);
    expect(flatMap(['a', 'b'], (x, i) => [x + i])).toEqual(['a0', 'b1']);
    expect(flatMap([1, 2], (x, _i, arr) => [x, arr.length])).toEqual([
      1, 2, 2, 2,
    ]);
  });

  test('zip', () => {
    expect(zip()).toEqual([]);
    expect(zip([1, 2], ['a', 'b'])).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
    expect(zip([1, 2, 3], ['a', 'b'])).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, undefined],
    ]);
    expect(zip([1, 2], ['a', 'b', 'c'])).toEqual([
      [1, 'a'],
      [2, 'b'],
      [undefined, 'c'],
    ]);
    expect(zip([1, 2])).toEqual([[1], [2]]);
    expect(zip([1, 2], ['a', 'b'], [true, false])).toEqual([
      [1, 'a', true],
      [2, 'b', false],
    ]);
  });

  test('unzip', () => {
    expect(unzip()).toEqual([]);
    expect(unzip([])).toEqual([]);
    expect(
      unzip([
        [1, 'a'],
        [2, 'b'],
      ]),
    ).toEqual([
      [1, 2],
      ['a', 'b'],
    ]);
    expect(unzip([[1], [2]])).toEqual([[1, 2]]);
    expect(
      unzip([
        [1, 'a', true],
        [2, 'b', false],
      ]),
    ).toEqual([
      [1, 2],
      ['a', 'b'],
      [true, false],
    ]);
  });

  test('sample', () => {
    expect(sample()).toBe(undefined);
    expect(sample([])).toBe(undefined);
    expect(sample([1])).toBe(1);
    const arr = [1, 2, 3, 4, 5];
    const sampled = sample(arr);
    expect(arr).toContain(sampled);
  });
});
