import { isInfinity } from '../../src';

describe('Types > isInfinity', () => {
  test('invalid cases', () => {
    expect(isInfinity()).toBe(false);
    expect(isInfinity('')).toBe(false);
    expect(isInfinity(0)).toBe(false);
    expect(isInfinity(false)).toBe(false);
    expect(isInfinity(null)).toBe(false);
    expect(isInfinity(Number.NaN)).toBe(false);
    expect(isInfinity('Infinity')).toBe(false);
    expect(isInfinity('1/0')).toBe(false);
  });

  test('valid cases', () => {
    expect(isInfinity(1 / 0)).toBe(true);
    expect(isInfinity(Number.POSITIVE_INFINITY)).toBe(true);
    expect(isInfinity(Number.NEGATIVE_INFINITY)).toBe(true);
  });
});
