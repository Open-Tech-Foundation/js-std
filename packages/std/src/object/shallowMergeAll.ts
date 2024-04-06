import isArr from '../types/isArr';

/**
 * Shallow merges objects and concatenates the array.
 *
 * @example
 * const a = [1];
 * const b = [2];
 * const c = [3];
 * shallowMergeAll(a, b, c); //=> [1, 2, 3]
 */
export default function shallowMergeAll(...objs: object[]): object {
  return objs.reduce((acc, cur) => {
    if (isArr(cur) && isArr(acc)) {
      return [...acc, ...cur];
    }

    return { ...acc, ...cur };
  });
}
