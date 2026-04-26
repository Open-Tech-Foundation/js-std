import uniq from './uniq';

/**
 * Returns unique values in all the given collections.
 *
 * @example
 *
 * const setA = [1, 2, 3, 4];
 * const setB = [2, 3, 5];
 * const setC = [2, 5, 3];
 * union([setA, setB, setC]) //=> [1, 2, 3, 4, 5]
 */
export default function union(
  collections: unknown[][] = [],
  by?: (val: unknown) => unknown,
): unknown[] {
  if (collections.length === 0) {
    return [];
  }

  const flattened = collections.reduce((acc, cur) => acc.concat(cur), []);

  return uniq(flattened, by);
}
