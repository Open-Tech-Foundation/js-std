import isArray from '../types/isArray';
import isPlainObject from '../types/isPlainObject';

export type IterableObj = {
  [key: number | string | symbol]: unknown;
};

/**
 * It deeply merges objects or arrays.
 *
 * @example
 * const a = { a: { b: 1 } };
 * const b = { a: { c: 2 } };
 * merge(a, b); //=> {a: { b: 1, c: 2 } }
 */
export default function merge(...objs: object[]): object {
  const filteredObjs = objs.filter((v) => isArray(v) || isPlainObject(v));
  const initialVal = isArray(filteredObjs[0]) ? [] : {};

  return filteredObjs.reduce((acc: IterableObj, cur) => {
    for (const [key, val] of Object.entries(cur)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      if (isArray(val) || isPlainObject(val)) {
        acc[key] = merge(acc[key] as object, val);
      } else {
        acc[key] = val;
      }
    }

    for (const sym of Object.getOwnPropertySymbols(cur)) {
      const val = (cur as IterableObj)[sym];
      if (isArray(val) || isPlainObject(val)) {
        acc[sym] = merge(acc[sym] as object, val as object);
      } else {
        acc[sym] = val;
      }
    }
    return acc;
  }, initialVal);
}
