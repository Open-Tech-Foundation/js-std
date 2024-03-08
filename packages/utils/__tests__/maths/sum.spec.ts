import { sum } from '../../src';

describe('Maths', () => {
  test('sum', () => {
    expect(sum()).toBe(0);
    expect(sum([])).toBe(0);
    expect(sum([1])).toBe(1);
    expect(sum([1, -1])).toBe(0);
    expect(sum([-1, -2])).toBe(-3);
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
    expect(sum([1.2, Math.PI])).toBeCloseTo(4.34);
    expect(sum([1, 2, 3, 4, 5.4], Math.round)).toBe(15);
    const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
    expect(sum(objects, (v) => v.n)).toBe(20);
    expect(sum(objects, (v, i) => v.n * i)).toBe(36);
    expect(sum([Infinity, Infinity])).toBe(Infinity);
  });
});
