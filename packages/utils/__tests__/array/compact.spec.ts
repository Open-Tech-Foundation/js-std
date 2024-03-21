import { compact } from '../../src';

describe('Array', () => {
  test('compact', () => {
    expect(compact()).toEqual([]);
    expect(compact([])).toEqual([]);
    expect(compact([undefined])).toEqual([]);
    expect(compact([undefined, null])).toEqual([]);
    expect(compact([undefined, null, 0])).toEqual([]);
    expect(compact([undefined, null, 0, 1])).toEqual([1]);
    expect(compact([undefined, null, 0, 1, -0, 2])).toEqual([1, 2]);
    expect(compact([undefined, null, 0, 1, -0, 2, false, 3])).toEqual([
      1, 2, 3,
    ]);
    expect(
      compact([undefined, null, 0, 1, -0, 2, false, 3, true, NaN])
    ).toEqual([1, 2, 3, true]);
    expect(compact(['apple', '', 'Mango'])).toEqual(['apple', 'Mango']);
    expect(compact(['apple', '', 'Mango', ' '])).toEqual([
      'apple',
      'Mango',
      ' ',
    ]);
  });
});
