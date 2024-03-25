import { percentage } from '../../src';

describe('Maths', () => {
  test('percentage', async () => {
    expect(() => percentage()).not.toThrow();
    expect(percentage()).toBe(NaN);
    expect(percentage(0)).toBe(NaN);
    expect(percentage(undefined, 0)).toBe(NaN);
    expect(percentage(0, 0)).toBe(NaN);
    expect(percentage(1, 0)).toBe(Infinity);
    expect(percentage(1, 1)).toBe(100);
    expect(percentage(0.5, 1)).toBe(50);
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(75, 150)).toBe(50);
    expect(percentage(8, 800)).toBe(1);
    expect(percentage(5, 150)).toBeCloseTo(3.33);
    expect(percentage(200, 100)).toBe(200);
  });
});
