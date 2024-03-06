import { isStr } from '../../src';

describe('Types > isStr', () => {
  test('invalid cases', () => {
    expect(isStr()).toBe(false);
    expect(isStr(null)).toBe(false);
    expect(isStr(1)).toBe(false);
    expect(isStr(['a', 'b', 'c'])).toBe(false);
  });

  test('valid cases', () => {
    expect(isStr('')).toBe(true);
    expect(isStr('abc')).toBe(true);
    expect(isStr(String('abc'))).toBe(true);
    expect(isStr(String(123))).toBe(true);
  });
});
