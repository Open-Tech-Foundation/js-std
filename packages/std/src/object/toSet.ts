import isEmpty from '../assert/isEmpty';
import parseFiniteNumberString from '../number/parseFiniteNumberString';
import isArray from '../types/isArray';
import isFunction from '../types/isFunction';
import isObject from '../types/isObject';
import clone from './clone';
import { hasUnsafeKey } from './isUnsafeKey';
import type { IterableObj } from './merge';
import { MAX_ARRAY_INDEX } from './set';
import toPath, { type PropertyPath } from './toPath';

/**
 * Sets the value to an object at the given path & returns new object.
 *
 * As with `set`, passing a function makes it an updater rather than the value
 * to store; the two cannot be told apart by type, so `value` is `unknown`.
 *
 * A numeric segment creates an array only up to `MAX_ARRAY_INDEX` (10,000).
 * Above that the branch becomes a plain object keyed by the number, so the
 * value is still stored and only the array-ness is dropped. The limit exists
 * because a lone large index in untrusted input — `a[100000000]` — would
 * otherwise produce an array whose `length` makes serialising the result cost
 * hundreds of megabytes. A flattened array starts at `[0]`, so one of any size
 * still round trips.
 *
 * `__proto__`, `constructor` and `prototype` are refused as path segments.
 * The path is checked before anything is written, so a path that will be
 * refused leaves the object exactly as it was — no partial branch.
 *
 * @param {T} obj The object to copy from.
 * @param {PropertyPath} path The path of the property to set.
 * @param {unknown} value The value to set, or a function to produce it.
 * @returns {T} A new object with the value set.
 *
 * @example
 *
 * toSet({}, 'a.b', 1) //=> {a: {b: 1} }
 */
export default function toSet<T>(
  obj: T,
  path: PropertyPath,
  value: unknown,
): T {
  const pathArr = toPath(path);

  if (isEmpty(pathArr) || hasUnsafeKey(pathArr)) {
    return obj;
  }

  const cObj = clone(obj);
  let curObj: IterableObj = cObj as IterableObj;

  for (let i = 0; i < pathArr.length; i++) {
    const prop = pathArr[i] as PropertyKey;
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

  return cObj as T;
}
