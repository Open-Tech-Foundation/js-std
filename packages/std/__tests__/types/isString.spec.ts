import { isString } from '../../src';

describe('Types > isString', () => {
  test('invalid cases', () => {
    expect(isString()).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(['a', 'b', 'c'])).toBe(false);
  });

  test('valid cases', () => {
    expect(isString('')).toBe(true);
    expect(isString('abc')).toBe(true);
    expect(isString(String('abc'))).toBe(true);
    expect(isString(String(123))).toBe(true);
  });
});
