import isEmpty from '../assert/isEmpty';
import isArray from '../types/isArray';
import isObject from '../types/isObject';
import { hasUnsafeKey } from './isUnsafeKey';
import type { IterableObj } from './merge';
import toPath, { type PropertyPath } from './toPath';

/**
 * Removes the property of the given object at the given path.
 *
 * `__proto__`, `constructor` and `prototype` are refused as path segments.
 * The path is checked before anything is written, so a path that will be
 * refused leaves the object exactly as it was — no partial branch.
 *
 * @example
 *
 * unset({a: 1, b: 2}, 'a') //=> {b: 2}
 */
export default function unset<T>(obj: T, path: PropertyPath): T {
  const pathArr = toPath(path);
  let curObj: IterableObj = obj as IterableObj;

  if (
    isEmpty(pathArr) ||
    hasUnsafeKey(pathArr) ||
    !(isObject(obj) || isArray(obj))
  ) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as string;
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
