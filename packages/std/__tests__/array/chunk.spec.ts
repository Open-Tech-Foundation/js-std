import { chunk } from '../../src';

describe('Array', () => {
  test('chunk', () => {
    expect(chunk()).toEqual([]);
    expect(chunk({})).toEqual([]);
    expect(chunk([])).toEqual([]);
    expect(chunk([1, 2, 3])).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 100)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 0)).toEqual([]);
    expect(chunk([1, 2, 3], -1)).toEqual([]);
    expect(chunk([{ a: 1 }, { a: 2 }, { a: 3 }], 2)).toEqual([
      [{ a: 1 }, { a: 2 }],
      [{ a: 3 }],
    ]);
  });
});
