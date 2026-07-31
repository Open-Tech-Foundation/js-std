import { clamp, mapRange } from '../../src';

describe('Maths > mapRange', () => {
  test('maps a value to the same fraction of another range', () => {
    expect(mapRange(5, [0, 10], [0, 100])).toBe(50);
    expect(mapRange(0, [0, 10], [0, 100])).toBe(0);
    expect(mapRange(10, [0, 10], [0, 100])).toBe(100);
  });

  test('maps between ranges that do not start at zero', () => {
    expect(mapRange(50, [0, 100], [32, 212])).toBe(122);
    expect(mapRange(20, [10, 30], [-1, 1])).toBe(0);
  });

  test('handles a non-integer result', () => {
    expect(mapRange(512, [0, 1023], [0, 255])).toBeCloseTo(127.6, 1);
  });

  test('inverts when the output range runs downwards', () => {
    expect(mapRange(0.25, [0, 1], [100, 0])).toBe(75);
    expect(mapRange(0, [0, 1], [100, 0])).toBe(100);
    expect(mapRange(1, [0, 1], [100, 0])).toBe(0);
  });

  test('inverts when the input range runs downwards', () => {
    expect(mapRange(10, [10, 0], [0, 100])).toBe(0);
    expect(mapRange(0, [10, 0], [0, 100])).toBe(100);
  });

  test('extrapolates outside the input range rather than clamping', () => {
    expect(mapRange(15, [0, 10], [0, 100])).toBe(150);
    expect(mapRange(-5, [0, 10], [0, 100])).toBe(-50);
  });

  test('composes with clamp where extrapolation is unwanted', () => {
    expect(clamp(mapRange(15, [0, 10], [0, 100]), 0, 100)).toBe(100);
  });

  test('throws on an empty input range', () => {
    expect(() => mapRange(5, [3, 3], [0, 100])).toThrow(RangeError);
    // Returning Infinity or NaN would carry the mistake somewhere else.
    expect(() => mapRange(5, [3, 3], [0, 100])).toThrow(/empty/);
  });

  test('allows an empty output range, which has one answer', () => {
    expect(mapRange(5, [0, 10], [7, 7])).toBe(7);
  });

  test('agrees with lerp on the unit input range', () => {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      expect(mapRange(t, [0, 1], [20, 80])).toBeCloseTo(20 + (80 - 20) * t, 10);
    }
  });

  test('is the identity when the ranges match', () => {
    for (const n of [-3, 0, 1.5, 7]) {
      expect(mapRange(n, [-10, 10], [-10, 10])).toBe(n);
    }
  });
});
