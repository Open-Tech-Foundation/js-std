import { isNegZero } from '../../src';

describe('Number', () => {
  test('isNegZero', () => {
    expect(isNegZero()).toBe(false);
    expect(isNegZero(undefined)).toBe(false);
    expect(isNegZero(null)).toBe(false);
    expect(isNegZero('')).toBe(false);
    expect(isNegZero('0')).toBe(false);
    expect(isNegZero([])).toBe(false);
    expect(isNegZero({})).toBe(false);
    expect(isNegZero(0)).toBe(false);
    expect(isNegZero(+0)).toBe(false);
    expect(isNegZero(-0)).toBe(true);
  });
});
