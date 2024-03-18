import { arrChunk } from '../../src';

describe('Array', () => {
  test('arrChunk', () => {
    expect(arrChunk()).toEqual([]);
    expect(arrChunk({})).toEqual([]);
    expect(arrChunk([])).toEqual([]);
    expect(arrChunk([1, 2, 3])).toEqual([[1], [2], [3]]);
    expect(arrChunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(arrChunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(arrChunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(arrChunk([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
    expect(arrChunk([1, 2, 3], 100)).toEqual([[1, 2, 3]]);
    expect(arrChunk([1, 2, 3], 0)).toEqual([]);
    expect(arrChunk([1, 2, 3], -1)).toEqual([]);
    expect(arrChunk([{ a: 1 }, { a: 2 }, { a: 3 }], 2)).toEqual([
      [{ a: 1 }, { a: 2 }],
      [{ a: 3 }],
    ]);
  });
});
