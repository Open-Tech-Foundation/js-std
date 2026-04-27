import isEmpty from '../assert/isEmpty';
import isObject from '../types/isObject';
import type { IterableObj } from './merge';
import toPath from './toPath';

/**
 * Gets the value of an object at the given path.
 *
 * @param {Object} obj The object to query.
 * @param {string|Array} path The path of the property to get.
 * @param {unknown} [defVal] The value returned for undefined resolved values.
 * @returns {unknown} The resolved value.
 *
 * @example
 * get({a: {b: {c: 1}}}, 'a.b.c') //=> 1
 */
export default function get(
  obj: object,
  path: string | unknown[],
  defVal?: unknown,
): unknown {
  let curObj = obj;
  const pathArr = toPath(path);

  if (isEmpty(pathArr)) {
    return defVal;
  }

  for (const prop of pathArr) {
    if (!isObject(curObj) || !Object.hasOwn(curObj, prop as PropertyKey)) {
      return defVal;
    }
    curObj = (curObj as IterableObj)[prop as PropertyKey] as object;
  }

  return curObj;
}
