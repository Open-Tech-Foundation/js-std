import isEmpty from '../assert/isEmpty';
import isObject from '../types/isObject';
import type { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Checks if the given path exists in the given object.
 *
 * @param {Object} obj The object to query.
 * @param {string|Array} path The path of the property to check.
 * @returns {boolean} True if the path exists, false otherwise.
 *
 * @example
 * has({a: 1}, 'a') //=> true
 * has({a: {b: 2}}, ['a', 'b']) //=> true
 */
export default function has(obj: object, path: string | unknown[]): boolean {
  const pathArr = toPath(path);

  if (isEmpty(pathArr)) {
    return false;
  }

  let curObj = obj;
  for (const prop of pathArr) {
    if (!isObject(curObj)) {
      return false;
    }

    if (!Object.hasOwn(curObj, prop as PropertyKey)) {
      return false;
    }

    curObj = (curObj as IterableObj)[prop as PropertyKey] as object;
  }

  return true;
}
