import { isZero } from '../../src';

describe('Number', () => {
  test('isZero', () => {
    expect(isZero()).toBe(false);
    expect(isZero(undefined)).toBe(false);
    expect(isZero(null)).toBe(false);
    expect(isZero('')).toBe(false);
    expect(isZero('0')).toBe(false);
    expect(isZero([])).toBe(false);
    expect(isZero({})).toBe(false);
    expect(isZero(-0)).toBe(false);
    expect(isZero(0)).toBe(true);
    expect(isZero(+0)).toBe(true);
  });
});
