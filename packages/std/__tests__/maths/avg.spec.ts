import { avg } from '../../src';

describe('Number', () => {
  test('avg', () => {
    expect(avg()).toBe(0);
    expect(avg([])).toBe(0);
    expect(avg([1])).toBe(1);
    expect(avg([4, 1, 7])).toBe(4);
    expect(avg([4, 2, 8])).toBeCloseTo(4.666);
    expect(avg([1, 4, 2, 5, 0])).toBe(2.4);
    expect(avg([10, 20, 40, 50])).toBe(30);
    expect(avg([1, 2, 3, 4, 5])).toBe(3);
    expect(avg([-1, -2])).toBe(-1.5);
    expect(avg([1, 2, 3, 4, 5], (n) => n ** 2)).toBe(11);
  });
});
