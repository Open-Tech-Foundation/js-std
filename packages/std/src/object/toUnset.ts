import isEmpty from '../assert/isEmpty';
import isArray from '../types/isArray';
import isNumber from '../types/isNumber';
import isObject from '../types/isObject';
import clone from './clone';
import type { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Removes the property of the given object at the given path & returns new object.
 *
 * @example
 *
 * unset({a: 1, b: 2}}, 'a') //=> true
 */
export default function toUnset<T>(obj: T, path: string | unknown[]): T {
  const pathArr = toPath(path);

  if (isEmpty(pathArr) || !(isObject(obj) || isArray(obj))) {
    return obj;
  }

  const cObj = clone(obj);
  let curObj: IterableObj = cObj as IterableObj;

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;

    if (i === pathArr.length - 1) {
      if (isArray(curObj)) {
        if (isNumber(prop, true)) {
          curObj.splice(prop, 1);
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
