import { max, median, min, quantile } from '../../src';

describe('Maths > quantile', () => {
  test('interpolates between the neighbouring values', () => {
    // The linear method R, NumPy and Excel's PERCENTILE.INC all default to.
    expect(quantile([1, 2, 3, 4], 0.25)).toBe(1.75);
    expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
    expect(quantile([1, 2, 3, 4], 0.75)).toBe(3.25);
    expect(quantile([1, 2, 3, 4, 5], 0.1)).toBeCloseTo(1.4, 10);
  });

  test('returns an observation when the position lands on one', () => {
    expect(quantile([1, 2, 3], 0.5)).toBe(2);
    expect(quantile([10, 20, 30, 40, 50], 0.25)).toBe(20);
  });

  test('gives the extremes at 0 and 1', () => {
    const arr = [7, 3, 9, 1, 5];

    expect(quantile(arr, 0)).toBe(min(arr));
    expect(quantile(arr, 1)).toBe(max(arr));
  });

  test('agrees with median at 0.5', () => {
    const arrays = [
      [1, 2, 3, 4],
      [1, 2, 3],
      [5],
      [2, 8, 4],
      [10, 20, 30, 40, 50, 60],
      [-5, 0, 5],
    ];

    for (const arr of arrays) {
      expect(quantile(arr, 0.5)).toBe(median(arr));
    }
  });

  test('sorts the values first', () => {
    expect(quantile([4, 1, 3, 2], 0.25)).toBe(1.75);
    // Numerically, not as strings — a default sort puts 10 before 9.
    expect(quantile([9, 10, 11], 0.5)).toBe(10);
  });

  test('takes the number from an iteratee', () => {
    const requests = [
      { durationMs: 100 },
      { durationMs: 200 },
      { durationMs: 300 },
      { durationMs: 400 },
    ];

    expect(quantile(requests, 0.75, (r) => r.durationMs)).toBe(325);
  });

  test('returns NaN when there is nothing to measure', () => {
    expect(quantile([], 0.5)).toBeNaN();
    expect(quantile(undefined, 0.5)).toBeNaN();
  });

  test('skips sparse holes', () => {
    const sparse = [, 1, , 3] as number[];

    expect(quantile(sparse, 0.5)).toBe(2);
  });

  test('handles a single value at every fraction', () => {
    for (const p of [0, 0.25, 0.5, 0.99, 1]) {
      expect(quantile([42], p)).toBe(42);
    }
  });

  test('rejects a fraction outside 0 to 1', () => {
    const message = 'The fraction must be a number between 0 and 1.';

    expect(() => quantile([1, 2], -0.1)).toThrow(message);
    expect(() => quantile([1, 2], 1.1)).toThrow(message);
    expect(() => quantile([1, 2], Number.NaN)).toThrow(message);
    // @ts-expect-error deliberately not a number
    expect(() => quantile([1, 2], '0.5')).toThrow(RangeError);
    // The check runs before the values, so an empty array still reports it.
    expect(() => quantile([], 2)).toThrow(RangeError);
  });

  test('is monotonic in p', () => {
    const arr = [5, 1, 9, 3, 7, 2, 8];
    let previous = Number.NEGATIVE_INFINITY;

    for (let p = 0; p <= 1.0001; p += 0.05) {
      const value = quantile(arr, Math.min(p, 1));
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});
