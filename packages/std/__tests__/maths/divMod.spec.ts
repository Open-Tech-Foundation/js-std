import { divMod } from '../../src';

describe('Maths', () => {
  test('divMod', () => {
    expect(divMod(4, 2)).toEqual([2, 0]);
    expect(divMod(11, 4)).toEqual([2.75, 3]);
    expect(divMod(1, 0)).toEqual([Infinity, NaN]);
    expect(divMod(0, 1)).toEqual([0, 0]);
    expect(divMod(-9, -2)).toEqual([4.5, -1]);
  });
});
