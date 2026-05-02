import { formatOrdinal } from '../../src';

describe('Number', () => {
  test('formatOrdinal', () => {
    expect(formatOrdinal(1)).toBe('1st');
    expect(formatOrdinal(2)).toBe('2nd');
    expect(formatOrdinal(3)).toBe('3rd');
    expect(formatOrdinal(4)).toBe('4th');
    expect(formatOrdinal(10)).toBe('10th');
    expect(formatOrdinal(11)).toBe('11th');
    expect(formatOrdinal(12)).toBe('12th');
    expect(formatOrdinal(13)).toBe('13th');
    expect(formatOrdinal(21)).toBe('21st');
    expect(formatOrdinal(22)).toBe('22nd');
    expect(formatOrdinal(23)).toBe('23rd');
    expect(formatOrdinal(100)).toBe('100th');
    expect(formatOrdinal(101)).toBe('101st');
    expect(formatOrdinal(-1)).toBe('-1st');
    expect(formatOrdinal(-2)).toBe('-2nd');
    expect(formatOrdinal(-3)).toBe('-3rd');
    expect(formatOrdinal(0)).toBe('0th');
    expect(formatOrdinal(1.5)).toBe('1.5');
    expect(formatOrdinal(Number.NaN)).toBe('NaN');
    expect(formatOrdinal(Number.POSITIVE_INFINITY)).toBe('Infinity');
  });
});
