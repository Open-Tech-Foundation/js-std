import collectPresentValues from './collectPresentValues';

/**
 * Calculates the value below which the given fraction of the data falls.
 *
 * `p` runs from `0` to `1`, so a 95th percentile is `quantile(values, 0.95)`.
 * `0` gives the minimum, `1` the maximum and `0.5` the median — the same value
 * `median` returns, by construction.
 *
 * A quantile rarely lands on an observation, so the two either side of it are
 * interpolated linearly: with `n` values, position `(n - 1) * p` is taken and
 * the fraction between the neighbouring values applied. This is the default of
 * R's `quantile`, NumPy's `percentile` and Excel's `PERCENTILE.INC` — the
 * method usually meant by "the 95th percentile" — but it is one of nine in
 * common use, and a figure produced by another will differ on small samples.
 *
 * @param {T[]} arr The source array.
 * @param {number} p The fraction, from 0 to 1.
 * @param {Function} [cb] The iteratee invoked per element to pick the number.
 * @returns {number} The quantile, or `NaN` if there are no values.
 * @throws {RangeError} If `p` is not a number from 0 to 1.
 *
 * @example
 * quantile([1, 2, 3, 4], 0.25) //=> 1.75
 * quantile([1, 2, 3, 4], 0.5) //=> 2.5
 * quantile([1, 2, 3, 4], 0.75) //=> 3.25
 *
 * @example
 * // The p95 of a set of response times.
 * quantile(requests, 0.95, (r) => r.durationMs)
 */
export default function quantile<T>(
  arr: T[] = [],
  p: number,
  cb?: (val: T, index: number) => number,
): number {
  if (typeof p !== 'number' || Number.isNaN(p) || p < 0 || p > 1) {
    throw new RangeError('The fraction must be a number between 0 and 1.');
  }

  const sorted = collectPresentValues(arr, cb).sort((a, b) => a - b);

  if (sorted.length === 0) {
    return Number.NaN;
  }

  // The position in the sorted values, which is generally between two of them.
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);

  if (lower === upper) {
    return sorted[lower] as number;
  }

  const weight = position - lower;

  return (
    (sorted[lower] as number) * (1 - weight) +
    (sorted[upper] as number) * weight
  );
}
