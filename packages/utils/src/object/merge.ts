import isArr from '../types/isArr';
import isObj from '../types/isObj';

/**
 * It deeply merges objects or arrays.
 *
 * @example
 * const a = { a: { b: 1 } };
 * const b = { a: { c: 2 } };
 * merge(a, b); //=> {a: { b: 1, c: 2 } }
 */
type IterableObj = {
  [key: number | string]: unknown;
};

export default function merge(...objs: object[]) {
  const filteredObjs = objs.filter((v) => isArr(v) || isObj(v));
  const initialVal = isArr(filteredObjs[0]) ? [] : {};

  return filteredObjs.reduce((acc: IterableObj, cur) => {
    for (const [key, val] of Object.entries(cur)) {
      if (isArr(val) || isObj(val)) {
        acc[key] = merge(acc[key] as object, val);
      } else {
        acc[key] = val;
      }
    }
    return acc;
  }, initialVal);
}
