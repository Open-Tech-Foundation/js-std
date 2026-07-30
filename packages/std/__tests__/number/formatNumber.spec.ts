import { formatNumber } from '../../src';

describe('Number > formatNumber', () => {
  test('groups the thousands', () => {
    expect(formatNumber(1234567.891)).toBe('1,234,567.891');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(999)).toBe('999');
  });

  test('follows the locale for the separators', () => {
    expect(formatNumber(1234.5, { locale: 'en-US' })).toBe('1,234.5');
    expect(formatNumber(1234.5, { locale: 'de-DE' })).toBe('1.234,5');
    expect(formatNumber(1234.5, { locale: 'fr-FR' })).toMatch(/234,5$/);
  });

  test('turns off grouping', () => {
    expect(formatNumber(1234.5, { grouping: false })).toBe('1234.5');
    expect(formatNumber(1234567, { grouping: false })).toBe('1234567');
  });

  test('applies the fraction bounds', () => {
    expect(formatNumber(1234.5678, { maxFraction: 2 })).toBe('1,234.57');
    expect(formatNumber(7, { minFraction: 2 })).toBe('7.00');
    expect(formatNumber(7.1, { minFraction: 3, maxFraction: 3 })).toBe('7.100');
  });

  test('formats a ratio as a percentage', () => {
    expect(formatNumber(0.42, { style: 'percent' })).toBe('42%');
    expect(formatNumber(1, { style: 'percent' })).toBe('100%');
    expect(formatNumber(0.4235, { style: 'percent', maxFraction: 1 })).toBe(
      '42.4%',
    );
  });

  test('handles the awkward numbers', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(-1234.5)).toBe('-1,234.5');
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('∞');
    expect(formatNumber(Number.NaN)).toBe('NaN');
  });

  test('rejects an unknown style', () => {
    // @ts-expect-error deliberately not an allowed style
    expect(() => formatNumber(1, { style: 'currency' })).toThrow(
      "The style option must be either 'decimal' or 'percent'.",
    );
  });

  test('rejects fraction bounds outside 0 to 100', () => {
    expect(() => formatNumber(1, { minFraction: -1 })).toThrow(RangeError);
    expect(() => formatNumber(1, { maxFraction: 101 })).toThrow(RangeError);
    expect(() => formatNumber(1, { maxFraction: 1.5 })).toThrow(RangeError);
  });

  test('rejects a minimum above the maximum', () => {
    expect(() => formatNumber(1, { minFraction: 3, maxFraction: 2 })).toThrow(
      'The minFraction option must be less than or equal to maxFraction.',
    );
  });
});
