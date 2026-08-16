import isEmpty from '../assert/isEmpty';
import parseFiniteNumberString from '../number/parseFiniteNumberString';
import isArray from '../types/isArray';
import isFunction from '../types/isFunction';
import isObject from '../types/isObject';
import { hasUnsafeKey } from './isUnsafeKey';
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
 * `__proto__`, `constructor` and `prototype` are refused as path segments.
 * The path is checked before anything is written, so a path that will be
 * refused leaves the object exactly as it was — no partial branch.
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
/**
 * The largest numeric path segment that will create an array.
 *
 * A segment decides whether a missing branch becomes an array or an object, and
 * that segment is often untrusted — `unflattenObject` reads exactly the flat
 * shapes that arrive from form bodies and query strings. `a[100000000]` would
 * otherwise cost eighteen bytes of input and produce an array whose `length` is
 * a hundred million: the array stays sparse and cheap, but anything that walks
 * it by length does not. `JSON.stringify` on that result is a 477 MB string.
 *
 * A larger index still stores its value; the branch just becomes a plain object
 * keyed by the number, so nothing is lost but the array-ness.
 */
export const MAX_ARRAY_INDEX = 1_000_000;

export default function set<T>(obj: T, path: PropertyPath, value: unknown): T {
  const pathArr = toPath(path);
  let curObj: IterableObj = obj as IterableObj;

  if (isEmpty(pathArr) || hasUnsafeKey(pathArr)) {
    return obj;
  }

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as string;
    if (i === pathArr.length - 1) {
      const v = isFunction(value) ? value(curObj[prop]) : value;
      curObj[prop] = v;
      break;
    }

    if (curObj[prop] === undefined) {
      const nextIndex = parseFiniteNumberString(String(pathArr[i + 1]));
      curObj[prop] =
        !Number.isNaN(nextIndex) &&
        nextIndex >= 0 &&
        nextIndex <= MAX_ARRAY_INDEX
          ? []
          : {};
    } else if (!(isObject(curObj[prop]) || isArray(curObj[prop]))) {
      return obj;
    }

    curObj = curObj[prop] as IterableObj;
  }

  return obj as T;
}
