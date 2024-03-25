import { prod } from '../../src';

describe('Maths', () => {
  test('prod', () => {
    expect(prod()).toBe(1);
    expect(prod([])).toBe(1);
    expect(prod([1])).toBe(1);
    expect(prod([1, -1])).toBe(-1);
    expect(prod([-1, -2])).toBe(2);
    expect(prod([1, 2, 3, 4, 5])).toBe(120);
    const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
    expect(prod(objects, (v) => v.n)).toBe(384);
  });
});
