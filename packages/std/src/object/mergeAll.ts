import isArr from '../types/isArr';
import isObj from '../types/isObj';

type IterableObj = {
  [key: number | string]: unknown;
};

/**
 * It deeply merges objects and concatenates the arrays if any present.
 *
 * @example
 * const a = { a: [1, 2], b: 0 };
 * const b = { a: [3, 4], b: 5 };
 * mergeAll(a, b) //=> {a: [1, 2, 3, 4], b: 5}
 */
export default function mergeAll(...objs: object[]): object {
  const filteredObjs = objs.filter((v) => isArr(v) || isObj(v));
  const initialVal = isArr(filteredObjs[0]) ? [] : {};

  return filteredObjs.reduce((acc: IterableObj, cur) => {
    if (isArr(cur) && isArr(acc)) {
      return [...acc, ...cur];
    }

    for (const [key, val] of Object.entries(cur)) {
      if (isArr(val) || isObj(val)) {
        acc[key] = mergeAll(acc[key] as object, val);
      } else {
        acc[key] = val;
      }
    }
    return acc;
  }, initialVal);
}
