import isArray from '../types/isArray';
import isPlainObject from '../types/isPlainObject';
import merge, { type IterableObj } from './merge';

/**
 * Deeply merges all the given objects or arrays.
 *
 * @example
 *
 * mergeAll([{a: 1}, {b: 2}]) //=> {a: 1, b: 2}
 *
 * mergeAll([[1], [2]]) //=> [1, 2]
 */
function deepMerge(acc: IterableObj, cur: IterableObj) {
  for (const [key, val] of Object.entries(cur)) {
    if (isArray(val) && isArray(acc[key])) {
      acc[key] = (acc[key] as unknown[]).concat(val);
    } else if (isPlainObject(val) && isPlainObject(acc[key])) {
      acc[key] = deepMerge(acc[key] as IterableObj, val as IterableObj);
    } else {
      acc[key] = val;
    }
  }
  return acc;
}

export default function mergeAll(
  ...objs: (Record<string, unknown> | unknown[])[]
): Record<string, unknown> | unknown[] {
  const filteredObjs = objs.filter((o) => isArray(o) || isPlainObject(o));

  if (filteredObjs.length === 0) {
    return {};
  }

  return filteredObjs.reduce((acc: IterableObj, cur, i) => {
    if (i === 0) {
      return (
        isArray(cur) ? cur.slice() : Object.assign({}, cur)
      ) as IterableObj;
    }

    if (isArray(acc) && isArray(cur)) {
      return (acc as unknown[]).concat(cur) as unknown as IterableObj;
    }

    if (isArray(acc) || isArray(cur)) {
      const target = isArray(acc)
        ? Object.fromEntries(Object.entries(acc))
        : Object.assign({}, acc);
      return deepMerge(target as IterableObj, cur as IterableObj);
    }

    return deepMerge(acc, cur as IterableObj);
  }, {} as IterableObj);
}
