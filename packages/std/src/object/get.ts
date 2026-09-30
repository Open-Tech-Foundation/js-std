import isEmpty from '../assert/isEmpty';
import isObject from '../types/isObject';
import type { IterableObj } from './merge';
import toPath, { type PropertyPath } from './toPath';

/** Options for {@link get}. */
export interface GetOptions {
  /** The value returned when the path resolves to `undefined`. */
  defaultValue?: unknown;
}

/**
 * Gets the value of an object at the given path.
 *
 * @param {Object} obj The object to query.
 * @param {string|Array} path The path of the property to get.
 * @param {GetOptions} [options] The fallback value returned when the path is missing.
 * @returns {unknown} The resolved value.
 *
 * @example
 * get({a: {b: {c: 1}}}, 'a.b.c') //=> 1
 * get({ a: 1 }, 'b', { defaultValue: 'missing' }) //=> 'missing'
 */
export default function get(
  obj: object,
  path: PropertyPath,
  options: GetOptions = {},
): unknown {
  const { defaultValue } = options;
  let curObj = obj;
  const pathArr = toPath(path);

  if (isEmpty(pathArr)) {
    return defaultValue;
  }

  for (const prop of pathArr) {
    if (!isObject(curObj) || !Object.hasOwn(curObj, prop as PropertyKey)) {
      return defaultValue;
    }
    curObj = (curObj as IterableObj)[prop as PropertyKey] as object;
  }

  return curObj;
}
