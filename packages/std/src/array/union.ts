import unique from './unique';

/**
 * Returns unique values in all the given collections.
 *
 * @param {unknown[][]} collections The arrays to union.
 * @param {Function} by The iteratee invoked per element.
 * @returns {unknown[]} A new array of combined unique values.
 *
 * @example
 * union([[1, 2], [2, 3]]) //=> [1, 2, 3]
 */
export default function union(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown,
): unknown[] {
  if (collections.length === 0) {
    return [];
  }

  // Built by appending rather than by `reduce` with `concat`: the latter copies
  // the whole accumulator on every step, which is quadratic in the total number
  // of elements — a union over 100,000 of them took 3.6 seconds.
  const flattened: unknown[] = [];

  for (const collection of collections) {
    if (Array.isArray(collection)) {
      for (const value of collection) {
        flattened.push(value);
      }
    } else {
      // `concat` appended a non-array as a single value; keep that.
      flattened.push(collection);
    }
  }

  return unique(flattened, by);
}
