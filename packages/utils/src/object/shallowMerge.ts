import isArr from '../types/isArr';

/**
 * Shallow merges objects or arrays.
 *
 * @example
 * const a = { a: 1 };
 * const b = { b: 2 };
 * shallowMerge(a, b); //=> { a: 1, b: 2 }
 */
export default function shallowMerge(...objs: object[]) {
  return objs.reduce((acc, cur) => {
    if (isArr(cur) && isArr(acc)) {
      return Object.assign([], acc, cur);
    }

    return { ...acc, ...cur };
  });
}
