import isArray from '../types/isArray';
import isPlainObject from '../types/isPlainObject';
import isUnsafeKey from './isUnsafeKey';
import { checkDepth } from './maxDepth';

export type IterableObj = {
  [key: number | string | symbol]: unknown;
};

export function createMergeTarget(source: object | undefined): IterableObj {
  if (isArray(source)) {
    return [] as unknown as IterableObj;
  }

  if (isPlainObject(source) && Object.getPrototypeOf(source) === null) {
    return Object.create(null) as IterableObj;
  }

  return {};
}

/**
 * It deeply merges objects or arrays.
 *
 * @example
 * const a = { a: { b: 1 } };
 * const b = { a: { c: 2 } };
 * merge(a, b); //=> {a: { b: 1, c: 2 } }
 */
function mergeAt(depth: number, ...objs: object[]): object {
  checkDepth(depth, 'merge');

  const filteredObjs = objs.filter((v) => isArray(v) || isPlainObject(v));
  const initialVal = createMergeTarget(filteredObjs[0]);

  return filteredObjs.reduce((acc: IterableObj, cur) => {
    for (const [key, val] of Object.entries(cur)) {
      if (isUnsafeKey(key)) {
        continue;
      }
      if (isArray(val) || isPlainObject(val)) {
        acc[key] = mergeAt(depth + 1, acc[key] as object, val);
      } else {
        acc[key] = val;
      }
    }

    for (const sym of Object.getOwnPropertySymbols(cur)) {
      const val = (cur as IterableObj)[sym];
      if (isArray(val) || isPlainObject(val)) {
        acc[sym] = mergeAt(depth + 1, acc[sym] as object, val as object);
      } else {
        acc[sym] = val;
      }
    }
    return acc;
  }, initialVal);
}

export default function merge(...objs: object[]): object {
  return mergeAt(0, ...objs);
}
