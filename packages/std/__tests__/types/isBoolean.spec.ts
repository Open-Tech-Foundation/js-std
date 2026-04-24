import { isBoolean } from '../../src';

describe('Types > isBoolean', () => {
  test('invalid cases', () => {
    expect(isBoolean()).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean('true')).toBe(false);
    expect(isBoolean('false')).toBe(false);
    expect(isBoolean('null')).toBe(false);
  });

  test('valid cases', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });
});
