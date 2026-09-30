import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import { gcd, lcm, lerp, stddev, variance } from '../../src';

describe('Maths > variance', () => {
  test('calculates population variance', () => {
    expect(variance([2, 4, 4, 4, 5, 5, 7, 9])).toBe(4);
  });

  test('returns NaN for empty array', () => {
    expect(variance([])).toBeNaN();
  });

  test('works with callback', () => {
    expect(variance([{ v: 2 }, { v: 4 }, { v: 6 }], (x) => x.v)).toBeCloseTo(
      2.6667,
      4,
    );
  });

  test('single element has zero variance', () => {
    expect(variance([5])).toBe(0);
  });

  test('ignores sparse holes', () => {
    expect(variance([1, , 3] as number[])).toBe(1);
    expect(variance([, ,] as number[])).toBeNaN();
  });
});

describe('Maths > stddev', () => {
  test('calculates population standard deviation', () => {
    expect(stddev([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2);
  });

  test('returns NaN for empty array', () => {
    expect(stddev([])).toBeNaN();
  });

  test('works with callback', () => {
    expect(stddev([{ v: 10 }, { v: 20 }, { v: 30 }], (x) => x.v)).toBeCloseTo(
      8.165,
      4,
    );
  });

  test('ignores sparse holes', () => {
    expect(stddev([1, , 3] as number[])).toBe(1);
    expect(stddev([, ,] as number[])).toBeNaN();
  });
});

describe('Maths > lerp', () => {
  test('interpolates between two values', () => {
    expect(lerp({ start: 0, end: 10, progress: 0.5 })).toBe(5);
    expect(lerp({ start: 100, end: 200, progress: 0.25 })).toBe(125);
  });

  test('returns start when progress is 0', () => {
    expect(lerp({ start: 5, end: 15, progress: 0 })).toBe(5);
  });

  test('returns end when progress is 1', () => {
    expect(lerp({ start: 5, end: 15, progress: 1 })).toBe(15);
  });

  test('extrapolates when progress is outside 0-1', () => {
    expect(lerp({ start: 0, end: 10, progress: 1.5 })).toBe(15);
    expect(lerp({ start: 0, end: 10, progress: -0.5 })).toBe(-5);
  });
});

describe('Maths > gcd', () => {
  test('calculates greatest common divisor', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(54, 24)).toBe(6);
    expect(gcd(7, 13)).toBe(1);
  });

  test('handles zero', () => {
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  test('handles negative numbers', () => {
    expect(gcd(-12, 8)).toBe(4);
    expect(gcd(12, -8)).toBe(4);
  });
});

describe('Maths > lcm', () => {
  test('calculates least common multiple', () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(21, 6)).toBe(42);
    expect(lcm(3, 5)).toBe(15);
  });

  test('returns 0 when either input is 0', () => {
    expect(lcm(0, 5)).toBe(0);
    expect(lcm(5, 0)).toBe(0);
  });

  test('handles negative numbers', () => {
    expect(lcm(-4, 6)).toBe(12);
    expect(lcm(4, -6)).toBe(12);
  });
});
