import { arrayDiff } from '../../src';

describe('Array', () => {
  test('arrayDiff', () => {
    expect(() => arrayDiff()).toThrow();
    expect(() => arrayDiff([])).not.toThrow();
    expect(arrayDiff([])).toEqual([]);
    expect(arrayDiff([], [])).toEqual([]);
    expect(arrayDiff([undefined], [])).toEqual([undefined]);
    expect(arrayDiff([undefined], [undefined])).toEqual([]);
    expect(arrayDiff([undefined, null], [undefined])).toEqual([null]);
    expect(arrayDiff([1], [])).toEqual([1]);
    expect(arrayDiff([1], [1])).toEqual([]);
    expect(arrayDiff([1], [1, 2])).toEqual([]);
    expect(arrayDiff([1, 2], [1, 2])).toEqual([]);
    expect(arrayDiff([1, 2, 3], [1, 2])).toEqual([3]);
    expect(arrayDiff([1, 2, 3, 4], [1, 2])).toEqual([3, 4]);
    expect(arrayDiff([1, 'a'], [1, 2])).toEqual(['a']);
    expect(arrayDiff([1, 'a', 5.0], [1, 2])).toEqual(['a', 5.0]);
    expect(arrayDiff([1, 'b'], ['b', 'c', 2])).toEqual([1]);
    expect(arrayDiff([0], [0])).toEqual([]);
    expect(arrayDiff([-0], [0])).toEqual([-0]);
    expect(arrayDiff([[]], [[]])).toEqual([[]]);
    expect(arrayDiff([{ a: 1 }], [{ a: 1 }])).toEqual([{ a: 1 }]);
    expect(arrayDiff(['apple', 'mango', 'orange'], ['mango', 'apple'])).toEqual(
      ['orange']
    );
  });
});
