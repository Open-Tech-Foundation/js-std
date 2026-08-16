import { randomInt, shuffle } from '../../src';

describe('Crypto > randomInt', () => {
  test('stays within the inclusive bounds', () => {
    for (let i = 0; i < 500; i++) {
      const v = randomInt(3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  test('a single-value range returns that value', () => {
    expect(randomInt(5, 5)).toBe(5);
    expect(randomInt(-1, -1)).toBe(-1);
  });

  test('handles negative ranges', () => {
    for (let i = 0; i < 200; i++) {
      const v = randomInt(-9, -4);
      expect(v).toBeGreaterThanOrEqual(-9);
      expect(v).toBeLessThanOrEqual(-4);
    }
  });

  test('rejects non-integer bounds and an inverted range', () => {
    expect(() => randomInt(1.5, 3)).toThrow(RangeError);
    expect(() => randomInt(1, 3.5)).toThrow(RangeError);
    expect(() => randomInt(5, 1)).toThrow();
  });

  // A range at or above 2**32 used to leave only `0` below the rejection
  // bound: the function returned `min` every time, after looping about 2**32
  // times to get there.
  test('handles a range of exactly 2**32', () => {
    const results = new Set<number>();
    for (let i = 0; i < 20; i++) results.add(randomInt(0, 2 ** 32 - 1));

    expect(results.size).toBeGreaterThan(1);
    for (const v of results) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(2 ** 32 - 1);
    }
  });

  test('handles ranges wider than 2**32', () => {
    const results = new Set<number>();
    for (let i = 0; i < 20; i++) results.add(randomInt(0, 2 ** 40));

    expect(results.size).toBeGreaterThan(1);
    for (const v of results) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(2 ** 40);
    }
  });

  test('accepts a span of MAX_SAFE_INTEGER and refuses more', () => {
    const v = randomInt(0, Number.MAX_SAFE_INTEGER);
    expect(Number.isSafeInteger(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(0);

    expect(() => randomInt(-(2 ** 53), 2 ** 53)).toThrow(RangeError);
  });

  // The rejection bound was inclusive, so the accepted count was never a
  // multiple of the range and the low end came up slightly more often.
  test('is uniform over a small range', () => {
    const N = 60000;
    const k = 6;
    const counts = new Array(k).fill(0);

    for (let i = 0; i < N; i++) counts[randomInt(0, k - 1)]++;

    const expected = N / k;
    const chiSquare = counts.reduce(
      (sum, c) => sum + (c - expected) ** 2 / expected,
      0,
    );

    // 5 degrees of freedom; 20.5 is p≈0.001, so this is stable in CI.
    expect(chiSquare).toBeLessThan(20.5);
  });
});

describe('Array > shuffle randomness source', () => {
  test('is a permutation of the input and does not mutate it', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input);

    expect(out).toHaveLength(input.length);
    expect([...out].sort((a, b) => a - b)).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('does not always return the same order', () => {
    const orders = new Set<string>();
    for (let i = 0; i < 50; i++) {
      orders.add(shuffle([1, 2, 3, 4, 5, 6]).join(','));
    }

    expect(orders.size).toBeGreaterThan(1);
  });
});
