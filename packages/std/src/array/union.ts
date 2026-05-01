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

  const flattened = collections.reduce((acc, cur) => acc.concat(cur), []);

  return unique(flattened, by);
}
