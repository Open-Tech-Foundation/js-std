import { mean } from '../../src';

describe('Number', () => {
  test('mean', () => {
    expect(mean()).toBe(NaN);
    expect(mean([])).toBe(NaN);
    expect(mean([1])).toBe(1);
    expect(mean([4, 1, 7])).toBe(4);
    expect(mean([4, 2, 8])).toBeCloseTo(4.67);
  });
});
