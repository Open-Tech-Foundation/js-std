import isEmpty from '../assert/isEmpty';
import isArray from '../types/isArray';
import isObject from '../types/isObject';
import type { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Removes the property of the given object at the given path.
 *
 * @example
 *
 * unset({a: 1, b: 2}}, 'a') //=> true
 */
export default function unset<T>(obj: T, path: string | unknown[]): T {
  const pathArr = toPath(path);
  let curObj: IterableObj = obj as IterableObj;

  if (isEmpty(pathArr) || !(isObject(obj) || isArray(obj))) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;

    if (i === pathArr.length - 1) {
      delete curObj[prop];
      break;
    }

    curObj = curObj[prop] as IterableObj;

    if (!(isObject(curObj) || isArray(curObj))) {
      return obj;
    }
  }

  return obj as T;
}
