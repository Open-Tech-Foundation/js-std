import { arrCompact } from '../../src';

describe('Array', () => {
  test('arrCompact', () => {
    expect(arrCompact()).toEqual([]);
    expect(arrCompact([])).toEqual([]);
    expect(arrCompact([undefined])).toEqual([]);
    expect(arrCompact([undefined, null])).toEqual([]);
    expect(arrCompact([undefined, null, 0])).toEqual([]);
    expect(arrCompact([undefined, null, 0, 1])).toEqual([1]);
    expect(arrCompact([undefined, null, 0, 1, -0, 2])).toEqual([1, 2]);
    expect(arrCompact([undefined, null, 0, 1, -0, 2, false, 3])).toEqual([
      1, 2, 3,
    ]);
    expect(
      arrCompact([undefined, null, 0, 1, -0, 2, false, 3, true, NaN])
    ).toEqual([1, 2, 3, true]);
    expect(arrCompact(['apple', '', 'Mango'])).toEqual(['apple', 'Mango']);
    expect(arrCompact(['apple', '', 'Mango', ' '])).toEqual([
      'apple',
      'Mango',
      ' ',
    ]);
  });
});
