import { isNumber } from '../../src';

describe('Types > isNumber', () => {
  test('invalid cases', () => {
    expect(isNumber()).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
    expect(isNumber(1n)).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber('', true)).toBe(false);
    expect(isNumber(' ')).toBe(false);
    expect(isNumber('a')).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber(Symbol(1))).toBe(false);
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(isNumber('1__000', true)).toBe(false);
    expect(isNumber('1___000', true)).toBe(false);
    expect(isNumber('_100 ', true)).toBe(false);
    expect(isNumber('100_', true)).toBe(false);
    expect(isNumber('0_1', true)).toBe(false);
  });

  test('valid cases', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-0)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber('-1.1', true)).toBe(true);
    expect(isNumber(1.5)).toBe(true);
    expect(isNumber(+'1')).toBe(true);
    expect(isNumber(-'1.1')).toBe(true);
    expect(isNumber('1', true)).toBe(true);
    expect(isNumber(1_000)).toBe(true);
    expect(isNumber('1_000', true)).toBe(true);
    expect(isNumber('1_000.000_001', true)).toBe(true);
    expect(isNumber('1_000_000_000_000', true)).toBe(true);
    expect(isNumber(255)).toBe(true);
    expect(isNumber(0xff)).toBe(true);
    expect(isNumber(0b11111111)).toBe(true);
    expect(isNumber(0.255e3)).toBe(true);
    expect(isNumber(Math.PI)).toBe(true);
    expect(isNumber(1_000_000_000_000)).toBe(true);
    expect(isNumber(1_050.95)).toBe(true);
    expect(isNumber(0o2_2_5_6)).toBe(true);
    expect(isNumber('0o2_2_5_6', true)).toBe(true);
    expect(isNumber('10_1', true)).toBe(true);
  });
});
