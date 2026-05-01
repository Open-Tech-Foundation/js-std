import { flatten } from '../../src';

describe('Array', () => {
  test('flatten', () => {
    expect(flatten()).toEqual([]);
    expect(flatten([])).toEqual([]);
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    expect(flatten([1, [2, 3]])).toEqual([1, 2, 3]);
    expect(flatten([1, [2, [3, [4]]]])).toEqual([1, 2, [3, [4]]]);
    expect(flatten([1, [2, [3, [4]]]], 1)).toEqual([1, 2, [3, [4]]]);
    expect(flatten([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
    expect(flatten([1, [2, [3, [4]]]], 3)).toEqual([1, 2, 3, 4]);
    expect(flatten([1, [2, [3, [4]]]], Number.POSITIVE_INFINITY)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(flatten([1, [2, [3, [4]]]], 0)).toEqual([1, [2, [3, [4]]]]);
    expect(flatten([1, [2, [3, [4]]]], -1)).toEqual([1, [2, [3, [4]]]]);
    expect(flatten([[{ a: 1 }], [{ b: 2 }]])).toEqual([{ a: 1 }, { b: 2 }]);
    expect(flatten([1, [2, , 4], 3])).toEqual([1, 2, undefined, 4, 3]);
    expect(flatten([1, [], [2, [3]]])).toEqual([1, 2, [3]]);
  });
});
