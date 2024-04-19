import { median } from '../../src';

describe('Maths', () => {
  test('median', () => {
    expect(median()).toBe(NaN);
    expect(median([])).toBe(NaN);
    expect(median([1])).toBe(1);
    expect(median([4, 1, 7])).toBe(1);
    expect(median([4, 2, 8])).toBe(2);
    expect(median([1, 4, 2, 5, 0])).toBe(2);
    expect(median([10, 20, 40, 50])).toBe(30);
  });
});
