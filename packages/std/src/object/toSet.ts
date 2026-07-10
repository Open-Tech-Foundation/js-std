import isEmpty from '../assert/isEmpty';
import parseFiniteNumberString from '../number/parseFiniteNumberString';
import isArray from '../types/isArray';
import isFunction from '../types/isFunction';
import isObject from '../types/isObject';
import clone from './clone';
import isUnsafePathKey from './isUnsafePathKey';
import type { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Sets the value to an object at the given path & returns new object.
 *
 * @example
 *
 * toSet({}, 'a.b', 1) //=> {a: {b: 1} }
 */
export default function toSet<T>(
  obj: T,
  path: string | unknown[],
  value: unknown | ((val: unknown) => unknown),
): T {
  const pathArr = toPath(path);
  const cObj = clone(obj);
  let curObj: IterableObj = cObj as IterableObj;

  if (isEmpty(pathArr)) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;
    if (isUnsafePathKey(prop)) {
      return obj;
    }

    if (i === pathArr.length - 1) {
      const v = isFunction(value) ? value(curObj[prop]) : value;
      curObj[prop] = v;
      break;
    }

    if (curObj[prop] === undefined) {
      curObj[prop] = !Number.isNaN(
        parseFiniteNumberString(String(pathArr[i + 1])),
      )
        ? []
        : {};
    } else if (!(isObject(curObj[prop]) || isArray(curObj[prop]))) {
      return obj;
    }

    curObj = curObj[prop] as IterableObj;
  }

  return cObj as T;
}
