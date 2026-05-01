import { inRange, round } from '../../src';

describe('Number > inRange', () => {
  test('returns true for values within range', () => {
    expect(inRange(3, 0, 5)).toBe(true);
    expect(inRange(0, 0, 5)).toBe(true);
    expect(inRange(5, 0, 5)).toBe(true);
  });

  test('returns false for values outside range', () => {
    expect(inRange(-1, 0, 5)).toBe(false);
    expect(inRange(6, 0, 5)).toBe(false);
  });

  test('handles reversed bounds', () => {
    expect(inRange(3, 5, 0)).toBe(false);
  });
});

describe('Number > round', () => {
  test('rounds to nearest integer by default', () => {
    expect(round(1.5)).toBe(2);
    expect(round(1.4)).toBe(1);
  });

  test('rounds with specified decimals', () => {
    expect(round(1.23456, 3)).toBe(1.235);
    expect(round(1.23456, 2)).toBe(1.23);
  });

  test('avoids floating point drift', () => {
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(2.675, 2)).toBe(2.68);
    expect(round(1.005, 2)).not.toBe(1);
  });

  test('handles negative numbers', () => {
    expect(round(-1.5)).toBe(-1);
    expect(round(-1.567, 2)).toBe(-1.57);
  });

  test('returns integer when decimals is 0', () => {
    expect(round(123.456, 0)).toBe(123);
  });
});
