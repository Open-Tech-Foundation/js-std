import { toNum } from '../../src';

describe('Number', () => {
  test('toNum', () => {
    expect(toNum()).toBe(Number.NaN);
    expect(toNum(undefined)).toBe(Number.NaN);
    expect(toNum(null)).toBe(Number.NaN);
    expect(toNum('')).toBe(Number.NaN);
    expect(toNum(' ')).toBe(Number.NaN);
    expect(toNum('a')).toBe(Number.NaN);
    expect(toNum(true)).toBe(Number.NaN);
    expect(toNum(false)).toBe(Number.NaN);
    expect(toNum([])).toBe(Number.NaN);
    expect(toNum({})).toBe(Number.NaN);
    expect(toNum(Number.NaN)).toBe(Number.NaN);
    expect(toNum(Number.POSITIVE_INFINITY)).toBe(Number.NaN);
    expect(toNum(Number.NEGATIVE_INFINITY)).toBe(Number.NaN);
    expect(toNum('0_1')).toBe(Number.NaN);
    expect(toNum('1__000')).toBe(Number.NaN);
    expect(toNum('Infinity')).toBe(Number.NaN);
    expect(toNum('-Infinity')).toBe(Number.NaN);
    expect(toNum(5n)).toBe(Number.NaN);

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
