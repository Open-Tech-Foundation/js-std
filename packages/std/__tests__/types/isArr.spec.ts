import { isArr } from '../../src';

describe('Types > isArr', () => {
  test('invalid cases', () => {
    expect(isArr()).toBe(false);
    expect(isArr('[]')).toBe(false);
    expect(isArr('Array')).toBe(false);
    expect(isArr({})).toBe(false);
    expect(isArr(new Uint8Array(32))).toBe(false);
  });

  test('valid cases', () => {
    expect(isArr([])).toBe(true);
    expect(isArr([1])).toBe(true);
    expect(isArr([])).toBe(true);
    expect(isArr(['a', 'b', 'c'])).toBe(true);
    expect(isArr(new Array(3))).toBe(true);
  });
});
