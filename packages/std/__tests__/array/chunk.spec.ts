import { chunk } from '../../src';

describe('Array', () => {
  test('chunk', () => {
    expect(chunk([1, 2, 3])).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 100)).toEqual([[1, 2, 3]]);
    expect(chunk([{ a: 1 }, { a: 2 }, { a: 3 }], 2)).toEqual([
      [{ a: 1 }, { a: 2 }],
      [{ a: 3 }],
    ]);
  });

  test('chunk throws on invalid size', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(
      'Size must be an integer greater than zero.',
    );
    expect(() => chunk([1, 2, 3], -1)).toThrow(
      'Size must be an integer greater than zero.',
    );
    expect(() => chunk([1, 2, 3], 1.5)).toThrow(
      'Size must be an integer greater than zero.',
    );
  });
});
