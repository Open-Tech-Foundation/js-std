import { arrDiff } from '../../src';

describe('Array', () => {
  test('arrDiff', () => {
    expect(arrDiff()).toEqual([]);
    expect(arrDiff([])).toEqual([]);
    expect(arrDiff([], [])).toEqual([]);
    expect(arrDiff([undefined], [])).toEqual([undefined]);
    expect(arrDiff([undefined], [undefined])).toEqual([]);
    expect(arrDiff([undefined, null], [undefined])).toEqual([null]);
    expect(arrDiff([1], [])).toEqual([1]);
    expect(arrDiff([1], [1])).toEqual([]);
    expect(arrDiff([1], [1, 2])).toEqual([]);
    expect(arrDiff([1, 2], [1, 2])).toEqual([]);
    expect(arrDiff([1, 2, 3], [1, 2])).toEqual([3]);
    expect(arrDiff([1, 2, 3, 4], [1, 2])).toEqual([3, 4]);
    expect(arrDiff([1, 'a'], [1, 2])).toEqual(['a']);
    expect(arrDiff([1, 'a', 5.0], [1, 2])).toEqual(['a', 5.0]);
    expect(arrDiff([1, 'b'], ['b', 'c', 2])).toEqual([1]);
    expect(arrDiff([0], [0])).toEqual([]);
    expect(arrDiff([-0], [0])).toEqual([-0]);
    expect(arrDiff([[]], [[]])).toEqual([]);
    expect(arrDiff([{ a: 1 }], [{ a: 1 }])).toEqual([]);
    expect(arrDiff([{ a: 1 }], [{ a: 1 }, { a: 2 }])).toEqual([]);
    expect(arrDiff([{ a: 1 }, {a: 3}], [{ a: 1 }, { a: 2 }])).toEqual([{a: 3}]);
    expect(arrDiff(['apple', 'mango', 'orange'], ['mango', 'apple'])).toEqual([
      'orange',
    ]);
  });
});
