import { clamp } from '../../src';

describe('Number', () => {
  test('clamp', () => {
    expect(clamp(10, -5, 5)).toBe(5);
    expect(clamp(-10, -5, 5)).toBe(-5);
    expect(clamp(-10, -1, -50)).toBe(-50);
    expect(clamp(0, 1000, 1366)).toBe(1000);
    expect(clamp(1000, 1000, 1366)).toBe(1000);
    expect(clamp(1001, 1000, 1366)).toBe(1001);
    expect(clamp(1500, 1000, 1366)).toBe(1366);
  });
});
