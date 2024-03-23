import isArr from '../types/isArr';
import isMap from '../types/isMap';
import isObj from '../types/isObj';
import isPureObj from '../types/isPureObj';
import isSet from '../types/isSet';

function cloneObj<T>(obj: T, objRefMap: WeakMap<WeakKey, unknown>): T {
  if (isPureObj(obj) && objRefMap.has(obj)) {
    return objRefMap.get(obj) as T;
  }

  if (isObj(obj)) {
    const cObj: Record<string, unknown> = {};
    objRefMap.set(obj, cObj);

    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        cObj[k] = cloneObj(obj[k as keyof typeof obj], objRefMap);
      }
    }

    return cObj as T;
  }

  if (isArr(obj)) {
    const arr = [] as unknown[];
    objRefMap.set(obj, arr);

    obj.forEach((i) => {
      arr.push(cloneObj(i, objRefMap));
    });

    return arr as T;
  }

  if (obj instanceof Date) {
    const d = new Date(obj);
    objRefMap.set(obj, d);
    return d as T;
  }

  if (isMap(obj)) {
    const map = new Map();
    objRefMap.set(obj, map);

    for (const [key, value] of obj) {
      map.set(cloneObj(key, objRefMap), cloneObj(value, objRefMap));
    }

    return map as T;
  }

  if (isSet(obj)) {
    const set = new Set();
    objRefMap.set(obj, set);

    for (const item of obj) {
      set.add(cloneObj(item, objRefMap));
    }

    return set as T;
  }

  return obj;
}

/**
 * It deeply clones the given value
 *
 * @example
 * const obj1 = {a: 1, b: ['x']}
 * const obj2 = clone(obj1)
 * obj1 === obj2 //=> false
 * obj1.b === obj2.b //=> false
 */
export default function clone<T>(val: T): T {
  const objRefMap = new WeakMap();
  return cloneObj(val, objRefMap);
}
