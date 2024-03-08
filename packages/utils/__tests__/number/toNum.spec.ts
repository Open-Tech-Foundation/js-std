import { toNum } from '../../src';

describe('Number', () => {
  test('toNum', () => {
    expect(toNum()).toBe(NaN);
    expect(toNum(undefined)).toBe(NaN);
    expect(toNum(null)).toBe(NaN);
    expect(toNum('')).toBe(NaN);
    expect(toNum(' ')).toBe(NaN);
    expect(toNum('a')).toBe(NaN);
    expect(toNum(true)).toBe(NaN);
    expect(toNum(false)).toBe(NaN);
    expect(toNum([])).toBe(NaN);
    expect(toNum({})).toBe(NaN);
    expect(toNum(NaN)).toBe(NaN);
    expect(toNum(Infinity)).toBe(NaN);
    expect(toNum(-Infinity)).toBe(NaN);
    expect(toNum('0_1')).toBe(NaN);
    expect(toNum('1__000')).toBe(NaN);
    expect(toNum('Infinity')).toBe(NaN);
    expect(toNum('-Infinity')).toBe(NaN);
    expect(toNum(5n)).toBe(NaN);

    expect(toNum(0)).toBe(0);
    expect(toNum(-0)).toBe(-0);
    expect(toNum(1)).toBe(1);
    expect(toNum(1.0)).toBe(1.0);
    expect(toNum(0xf)).toBe(15);
    expect(toNum(0o755)).toBe(493);
    expect(toNum(0b10)).toBe(2);
    expect(toNum(5e1)).toBe(50);
    expect(toNum('0')).toBe(0);
    expect(toNum('1')).toBe(1);
    expect(toNum('-5')).toBe(-5);
    expect(toNum('1.3')).toBe(1.3);
    expect(toNum('1_0')).toBe(10);
    expect(toNum('1_000_00')).toBe(100000);
  });
});
