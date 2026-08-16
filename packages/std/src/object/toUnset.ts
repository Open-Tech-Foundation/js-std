import isEmpty from '../assert/isEmpty';
import parseFiniteNumberString from '../number/parseFiniteNumberString';
import isArray from '../types/isArray';
import isObject from '../types/isObject';
import clone from './clone';
import { hasUnsafeKey } from './isUnsafeKey';
import type { IterableObj } from './merge';
import toPath, { type PropertyPath } from './toPath';

/**
 * Removes the property of the given object at the given path & returns new object.
 *
 * `__proto__`, `constructor` and `prototype` are refused as path segments.
 * The path is checked before anything is written, so a path that will be
 * refused leaves the object exactly as it was — no partial branch.
 *
 * @example
 *
 * toUnset({a: 1, b: 2}, 'a') //=> {b: 2}
 */
export default function toUnset<T>(obj: T, path: PropertyPath): T {
  const pathArr = toPath(path);

  if (
    isEmpty(pathArr) ||
    hasUnsafeKey(pathArr) ||
    !(isObject(obj) || isArray(obj))
  ) {
    return obj;
  }

  const cObj = clone(obj);
  let curObj: IterableObj = cObj as IterableObj;

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;
    if (i === pathArr.length - 1) {
      if (isArray(curObj)) {
        if (!Number.isNaN(parseFiniteNumberString(String(prop)))) {
          curObj.splice(prop as unknown as number, 1);
        }
      } else {
        delete curObj[prop];
      }
      break;
    }

    curObj = curObj[prop] as IterableObj;

    if (!(isObject(curObj) || isArray(curObj))) {
      return cObj;
    }
  }

  return cObj as T;
}
