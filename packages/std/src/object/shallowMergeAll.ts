import isArr from '../types/isArr';
import isObj from '../types/isObj';
import shallowMerge from './shallowMerge';

/**
 * Merges all the given objects or arrays.
 *
 * @example
 *
 * shallowMergeAll([{a: 1}, {b: 2}]) //=> {a: 1, b: 2}
 *
 * shallowMergeAll([[1], [2]]) //=> [1, 2]
 */
export default function shallowMergeAll(
  ...objs: (Record<string, unknown> | unknown[])[]
): Record<string, unknown> | unknown[] {
  const filteredObjs = objs.filter((o) => o !== null && o !== undefined);

  if (filteredObjs.length === 0) {
    return {};
  }

  return filteredObjs.reduce(
    (acc, cur, i) => {
      if (i === 0) {
        return isArr(cur) ? cur.slice() : Object.assign({}, cur);
      }
      if (isArr(acc) && isArr(cur)) {
        return acc.concat(cur);
      }
      const target =
        isArr(acc) && isObj(cur)
          ? Object.fromEntries(Object.entries(acc))
          : isArr(acc)
            ? acc.slice()
            : Object.assign({}, acc);
      return Object.assign(target, cur);
    },
    {} as Record<string, unknown> | unknown[],
  );
}
