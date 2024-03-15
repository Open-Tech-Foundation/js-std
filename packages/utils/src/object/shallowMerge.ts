import isArr from '../types/isArr';

/**
 * Shallow merges objects or arrays.
 *
 * @example
 *
 */
export default function shallowMerge(...objs: object[]) {
  return objs.reduce((acc, cur) => {
    if (isArr(cur) && isArr(acc)) {
      return Object.assign([], acc, cur);
    }

    return { ...acc, ...cur };
  });
}
