import isArr from '../types/isArr';

/**
 * Returns a new set or array containing elements in all given collections.
 *
 * @example
 *
 * const setA = new Set([1, 2, 3, 4]);
 * const setB = new Set([3, 5]);
 * intersection(setA, setB) //=> Set {3}
 */
export default function intersection(
  ...collections: (unknown[] | Set<unknown>)[]
) {
  const out = collections.reduce((acc, cur) => {
    const _intersection = new Set();
    const prev = isArr(acc) ? new Set(acc) : acc;
    for (const elem of cur) {
      if (prev.has(elem)) {
        _intersection.add(elem);
      }
    }

    return _intersection;
  });

  return isArr(collections[0]) ? [...out] : out;
}
