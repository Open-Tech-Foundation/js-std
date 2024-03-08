import { isNum } from '../../src';

describe('Types > isNum', () => {
  test('invalid cases', () => {
    expect(isNum()).toBe(false);
    expect(isNum(undefined)).toBe(false);
    expect(isNum(null)).toBe(false);
    expect(isNum(true)).toBe(false);
    expect(isNum(false)).toBe(false);
    expect(isNum(1n)).toBe(false);
    expect(isNum('')).toBe(false);
    expect(isNum('', true)).toBe(false);
    expect(isNum(' ')).toBe(false);
    expect(isNum('a')).toBe(false);
    expect(isNum([])).toBe(false);
    expect(isNum({})).toBe(false);
    expect(isNum(Symbol(1))).toBe(false);
    expect(isNum(NaN)).toBe(false);
    expect(isNum(Infinity)).toBe(false);
    expect(isNum(-Infinity)).toBe(false);
    expect(isNum('1__000', true)).toBe(false);
    expect(isNum('1___000', true)).toBe(false);
    expect(isNum('_100 ', true)).toBe(false);
    expect(isNum('100_', true)).toBe(false);
    expect(isNum('0_1', true)).toBe(false);
  });

  test('valid cases', () => {
    expect(isNum(0)).toBe(true);
    expect(isNum(-0)).toBe(true);
    expect(isNum(1)).toBe(true);
    expect(isNum(-1)).toBe(true);
    expect(isNum('-1.1', true)).toBe(true);
    expect(isNum(1.5)).toBe(true);
    expect(isNum(+'1')).toBe(true);
    expect(isNum(-'1.1')).toBe(true);
    expect(isNum('1', true)).toBe(true);
    expect(isNum(1_000)).toBe(true);
    expect(isNum('1_000', true)).toBe(true);
    expect(isNum('1_000.000_001', true)).toBe(true);
    expect(isNum('1_000_000_000_000', true)).toBe(true);
    expect(isNum(255)).toBe(true);
    expect(isNum(0xff)).toBe(true);
    expect(isNum(0b11111111)).toBe(true);
    expect(isNum(0.255e3)).toBe(true);
    expect(isNum(Math.PI)).toBe(true);
    expect(isNum(1_000_000_000_000)).toBe(true);
    expect(isNum(1_050.95)).toBe(true);
    expect(isNum(0o2_2_5_6)).toBe(true);
    expect(isNum('0o2_2_5_6', true)).toBe(true);
    expect(isNum('10_1', true)).toBe(true);
  });
});
