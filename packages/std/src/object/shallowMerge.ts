import isArray from '../types/isArray';
import isPlainObject from '../types/isPlainObject';

/**
 * Merges the given two objects or arrays.
 *
 * @example
 *
 * shallowMerge({a: 1}, {b: 2}) //=> {a: 1, b: 2}
 *
 * shallowMerge([1], [2]) //=> [1, 2]
 */
export default function shallowMerge(
  ...objs: (Record<string, unknown> | unknown[])[]
): Record<string, unknown> | unknown[] {
  const filteredObjs = objs.filter((o) => o !== null && o !== undefined);

  if (filteredObjs.length === 0) {
    return {};
  }

  return filteredObjs.reduce(
    (acc, cur, i) => {
      if (i === 0) {
        return isArray(cur) ? cur.slice() : Object.assign({}, cur);
      }
      const target =
        isArray(acc) && isPlainObject(cur)
          ? Object.fromEntries(Object.entries(acc))
          : isArray(acc)
            ? acc.slice()
            : Object.assign({}, acc);
      return Object.assign(target, cur);
    },
    {} as Record<string, unknown> | unknown[],
  );
}
