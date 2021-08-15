import { percentageOf } from '../../lib/index.esm.js';

describe('Maths', () => {
  test('percentage', async () => {
    expect(() => percentageOf()).not.toThrow();
    expect(percentageOf()).toBe(NaN);
    expect(percentageOf(0)).toBe(NaN);
    expect(percentageOf(undefined, 0)).toBe(NaN);
    expect(percentageOf(0, 0)).toBe(0);
    expect(percentageOf(1, 0)).toBe(0);
    expect(percentageOf(1, 1)).toBe(0.01);
    expect(percentageOf(1, 1, true)).toBe(0);
    expect(percentageOf(5, 100, true)).toBe(5);
    expect(percentageOf(5, 25, true)).toBe(1);
    expect(percentageOf(0.5, 10)).toBe(0.05);
    expect(percentageOf(10, 80)).toBe(8);
    expect(percentageOf(50, 900)).toBe(450);
  });
});
