/**
 * Shallow merges objects or arrays and also returns union of array items.
 *
 * @example
 *
 */
export default function shallowMergeAll(...objs: object[]) {
  return objs.reduce((acc, cur) => {
    if (Array.isArray(cur) && Array.isArray(acc)) {
      return [...acc, ...cur];
    }

    return { ...acc, ...cur };
  });
}
