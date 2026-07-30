import isEmpty from '../assert/isEmpty';
import parseFiniteNumberString from '../number/parseFiniteNumberString';
import isArray from '../types/isArray';
import isFunction from '../types/isFunction';
import isObject from '../types/isObject';
import isUnsafePathKey from './isUnsafePathKey';
import type { IterableObj } from './merge';
import toPath, { type PropertyPath } from './toPath';

/**
 * Sets the value to an object at the given path.
 *
 * Passing a function makes it an updater: it receives the current value at
 * the path and its result is stored. There is no type that distinguishes the
 * two — a function is a perfectly good value to store — so `value` is
 * `unknown` and the form is chosen at run time.
 *
 * @param {T} obj The object to modify.
 * @param {PropertyPath} path The path of the property to set.
 * @param {unknown} value The value to set, or a function to produce it.
 * @returns {T} The modified object.
 *
 * @example
 * set({}, 'a.b', 1) //=> {a: {b: 1} }
 *
 * @example
 * set({ a: 1 }, 'a', (n) => (n as number) + 1) //=> { a: 2 }
 */
export default function set<T>(obj: T, path: PropertyPath, value: unknown): T {
  const pathArr = toPath(path);
  let curObj: IterableObj = obj as IterableObj;

  if (isEmpty(pathArr)) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as string;
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

  return obj as T;
}
