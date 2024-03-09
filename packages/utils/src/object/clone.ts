import isObj from '../types/isObj';

/**
 * It deeply clones the given value
 *
 * @example
 * const obj1 = {a: 1, b: ['x']}
 * const obj2 = clone(obj1)
 * obj1 === obj2 //=> false
 * obj1.b === obj2.b //=> false
 */
export default function clone<T>(obj: T): T {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (isObj(obj)) {
    const cObj: Record<string, unknown> = {};
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        cObj[k] = clone(obj[k as keyof typeof obj]);
      }
    }

    return cObj as T;
  }

  if (Array.isArray(obj)) {
    const arr = [];
    for (const i of obj) {
      arr.push(clone(i));
    }

    return arr as T;
  }

  if (obj instanceof Date) {
    return new Date(obj) as T;
  }

  return obj;
}
